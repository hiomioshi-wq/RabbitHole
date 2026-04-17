import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Site, Category, CuratorPersona, AIModel, Aesthetic, TimeEra } from '../types';
import { AI_MODELS } from '../constants';

// Access API key directly so bundlers can replace it.
// We use a safe access pattern for runtime environments where process might be missing.
const API_KEY = (() => {
  try {
    return (import.meta as any).env.VITE_GEMINI_API_KEY || (process as any).env.GEMINI_API_KEY || (process as any).env.API_KEY;
  } catch (e) {
    return '';
  }
})();

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

if (!ai) {
    console.warn("Rabbit Hole: No API Key found. AI features will be disabled.");
}

// Simple, non-crashing ID generator
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const executeWithAutoRouter = async (
    prompt: string,
    initialModel: AIModel,
    thinkingBudget: number,
    retries = 3
): Promise<GenerateContentResponse> => {
    let currentModel = initialModel;
    let attempts = 0;
    const modelsTried = new Set<string>();
    
    while (attempts <= retries) {
        try {
            const config = getConfig(currentModel, thinkingBudget);
            return await ai!.models.generateContent({
                model: currentModel.id,
                contents: prompt,
                config: config
            });
        } catch (error: any) {
            const isQuotaError = error.status === 429 || 
                                 error.code === 429 || 
                                 error.message?.includes('429') || 
                                 error.message?.toLowerCase().includes('quota') ||
                                 error.message?.toLowerCase().includes('resource_exhausted') ||
                                 error.status === 503 ||
                                 error.code === 503;
                                 
            if (isQuotaError) {
                modelsTried.add(currentModel.id);
                console.warn(`Model ${currentModel.id} hit rate limit or unavailable. Finding fallback...`);
                
                // Find a model we haven't tried yet
                const fallbackModel = AI_MODELS.find(m => !modelsTried.has(m.id));
                
                if (fallbackModel) {
                    console.log(`Auto-routing to ${fallbackModel.id}...`);
                    currentModel = fallbackModel;
                    attempts++;
                    continue; // Try immediately with new model
                } else {
                    console.warn("All models exhausted. Waiting before retry...");
                    await new Promise(resolve => setTimeout(resolve, 2000 * (attempts + 1)));
                    // Reset tried models to try again
                    modelsTried.clear();
                    currentModel = initialModel;
                    attempts++;
                }
            } else {
                throw error;
            }
        }
    }
    throw new Error("Max retries exceeded across all models.");
};

const parseResponse = (text: string | undefined): Site[] => {
  if (!text) return [];
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    const cleanText = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanText);
    
    if (!Array.isArray(parsedData)) {
        return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return parsedData.map((item: any) => ({
      ...item,
      id: generateId(), // Use safe generator
      category: Object.values(Category).includes(item.category) ? item.category : Category.MYSTERY
    }));
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return [];
  }
};

const getConfig = (model: AIModel, thinkingBudget: number) => {
    // NOTE: 'responseMimeType: "application/json"' is NOT supported when using tools like googleSearch.
    // We must rely on prompt engineering to get JSON output.
    const baseConfig: any = {
        tools: [{ googleSearch: {} }],
    };

    if (model.supportsThinking && thinkingBudget > 0) {
        const budget = Math.min(thinkingBudget, model.maxThinkingBudget || 8192);
        baseConfig.maxOutputTokens = budget + 4096; // Ensure enough room for output after thinking
        baseConfig.thinkingConfig = { thinkingBudget: budget };
    }

    return baseConfig;
};

// --- Main Fetch Function ---
export const fetchRecommendations = async (
    category: Category, 
    persona: CuratorPersona, 
    model: AIModel,
    thinkingBudget: number = 0,
    aesthetic: Aesthetic,
    timeEra: TimeEra,
    count: number = 3
): Promise<Site[]> => {
  if (!ai) return [];

  const categoryPrompt = category === Category.ALL ? "any category" : `the category '${category}'`;
  
  // Time Travel Logic
  const timeConstraint = timeEra.id === 'all' 
    ? "" 
    : `STRICT CONSTRAINT: Only find websites established between ${timeEra.range}, or websites that perfectly emulate the design aesthetic of that era.`;

  const prompt = `
    ${persona.promptModifier}
    ${aesthetic.promptModifier}
    ${timeConstraint}
    
    Find ${count} REAL, OBSCURE websites in ${categoryPrompt}.
    Rules: Must be real/online. No mainstream sites.
    
    Return JSON array in \`\`\`json:
    [{ 
      "title": "...", 
      "url": "https://...", 
      "description": "...", 
      "category": "One of: ${Object.values(Category).join(', ')}", 
      "tags": ["t1", "t2"], 
      "yearEstablished": "YYYY", 
      "curatorNote": "...",
      "designVibe": "e.g. Minimalist Glitch",
      "technicalStack": ["React", "WebGL"],
      "vibeScore": 85
    }]
  `;

  try {
    const response = await executeWithAutoRouter(prompt, model, thinkingBudget);
    return parseResponse(response.text);
  } catch (error) {
    console.error("Gemini discovery failed:", error);
    return [];
  }
};

export const searchSites = async (
    query: string, 
    persona: CuratorPersona, 
    model: AIModel,
    thinkingBudget: number = 0,
    aesthetic: Aesthetic,
    timeEra: TimeEra,
    count: number = 3
): Promise<Site[]> => {
  if (!ai) return [];

  const timeConstraint = timeEra.id === 'all' 
    ? "" 
    : `STRICT CONSTRAINT: Only find websites established between ${timeEra.range}, or websites that perfectly emulate the design aesthetic of that era.`;

  const prompt = `
    ${persona.promptModifier}
    ${aesthetic.promptModifier}
    ${timeConstraint}
    
    Find ${count} REAL, UNIQUE websites for: "${query}".
    
    Return JSON array in \`\`\`json:
    [{ 
      "title": "...", 
      "url": "https://...", 
      "description": "...", 
      "category": "One of: ${Object.values(Category).join(', ')}", 
      "tags": ["t1", "t2"], 
      "yearEstablished": "YYYY", 
      "curatorNote": "...",
      "designVibe": "Thematic vibe",
      "technicalStack": [],
      "vibeScore": 60
    }]
  `;

  try {
    const response = await executeWithAutoRouter(prompt, model, thinkingBudget);
    return parseResponse(response.text);
  } catch (error) {
    console.error("Gemini search failed:", error);
    return [];
  }
};

export const findSimilarSites = async (
    url: string, 
    title: string, 
    model: AIModel,
    thinkingBudget: number = 0,
    aesthetic: Aesthetic,
    timeEra: TimeEra,
    count: number = 3
): Promise<Site[]> => {
  if (!ai) return [];

  const timeConstraint = timeEra.id === 'all' 
    ? "" 
    : `STRICT CONSTRAINT: Only find websites established between ${timeEra.range}, or websites that perfectly emulate the design aesthetic of that era.`;

  const prompt = `
    Find ${count} websites SIMILAR to: "${title}" (${url}).
    FILTER: Favor aesthetic: ${aesthetic.name}.
    ${timeConstraint}
    
    Return JSON array in \`\`\`json:
    [{ 
      "title": "...", 
      "url": "https://...", 
      "description": "...", 
      "category": "One of: ${Object.values(Category).join(', ')}", 
      "tags": ["t1", "t2"], 
      "yearEstablished": "YYYY", 
      "curatorNote": "...",
      "designVibe": "Similar aesthetic",
      "technicalStack": [],
      "vibeScore": 75
    }]
  `;

  try {
    const response = await executeWithAutoRouter(prompt, model, thinkingBudget);
    return parseResponse(response.text);
  } catch (error) {
    console.error("Gemini similarity search failed:", error);
    return [];
  }
};

export const getSiteAnalysis = async (site: Site, persona: CuratorPersona, model: AIModel, thinkingBudget: number = 0, aesthetic: Aesthetic, timeEra: TimeEra): Promise<string> => {
    if (!ai) return "AI connection unavailable.";
    
    const timeContext = timeEra.id === 'all' ? "" : `The user is exploring the ${timeEra.name} era (${timeEra.range}).`;

    const prompt = `
        ${persona.promptModifier}
        
        Analyze this website: ${site.title} (${site.url}).
        CONTEXT: ${aesthetic.name} mood. ${timeContext}
        
        Provide a fast 50-word breakdown covering:
        1. Unique features.
        2. Design philosophy.
    `;
    
    try {
        const response = await executeWithAutoRouter(prompt, model, thinkingBudget);
        return response.text || "Analysis failed.";
    } catch (e) {
        console.error(e);
        return "Neural link severed. Analysis unavailable.";
    }
}