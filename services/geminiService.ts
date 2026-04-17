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
    
    if (!ai) {
        throw new Error("API_KEY_MISSING: Gemini API Key is missing. AI features are disabled.");
    }
    
    while (attempts <= retries) {
        try {
            const config = getConfig(currentModel, thinkingBudget);
            return await ai.models.generateContent({
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
            
            const isNetworkError = error.name === 'TypeError' && error.message === 'Failed to fetch';
                                 
            if (isNetworkError) {
                throw new Error("NETWORK_ERROR: Attempted to connect to Gemini but the network request failed.");
            }

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
                throw new Error(`API_ERROR: Model returned an unexpected server error: ${error.message || 'Unknown'}`);
            }
        }
    }
    throw new Error("EXHAUSTED: Max retries exceeded across all models. The AI service is currently hammered.");
};

const parseResponse = (text: string | undefined): Site[] => {
  if (!text) return [];
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    const cleanText = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanText);
    
    if (!Array.isArray(parsedData)) {
        throw new Error("PARSING_ERROR: AI returned valid JSON, but it was not an array of sites.");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return parsedData.map((item: any) => ({
      ...item,
      id: generateId(), // Use safe generator
      category: Object.values(Category).includes(item.category) ? item.category : Category.MYSTERY
    }));
  } catch (error: any) {
    if (error.message && error.message.includes("PARSING_ERROR")) {
        throw error;
    }
    console.error("Failed to parse Gemini response", error);
    throw new Error("PARSING_ERROR: Could not extract valid JSON from the AI response.");
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
    count: number = 3,
    tagContext?: string | null
): Promise<Site[]> => {
  if (!ai) return [];

  const categoryPrompt = category === Category.ALL ? "any category" : `the category '${category}'`;
  const tagPrompt = tagContext ? `CONSTRAINT: Must be highly relevant to the concept or tag "${tagContext}".` : "";
  
  // Time Travel Logic
  const timeConstraint = timeEra.id === 'all' 
    ? "" 
    : `STRICT CONSTRAINT: Only find websites established between ${timeEra.range}, or websites that perfectly emulate the design aesthetic of that era. YOU MUST FOLLOW THIS ERA CONSTRAINT.`;

  const prompt = `
    SYSTEM PERSONA INITIALIZATION:
    =================================
    ${persona.promptModifier}
    =================================

    AESTHETIC & TIMELINE DIRECTIVES:
    =================================
    ${aesthetic.promptModifier}
    ${timeConstraint}
    ${tagPrompt}
    =================================
    
    TASK FOREGROUNDING:
    You are NOT an AI assistant. You are exactly the persona described above inside the SYSTEM PERSONA INITIALIZATION. You must find ${count} REAL, OBSCURE websites in ${categoryPrompt} that perfectly align with your twisted, specific worldview and the demanded aesthetic.
    
    Rules: 
    1. Must be real/online right now. 
    2. No mainstream, boring, or generic corporate sites.
    3. The "curatorNote" MUST be written fully in character, reflecting your exact personality, quirks, catchphrases, and psychotic tendencies as outlined in your prompt modifier. Speak directly to the user in this field.

    Return JSON array in \`\`\`json format:
    [{ 
      "title": "<Actual Website Title>", 
      "url": "<Valid https:// URL>", 
      "description": "<Engaging 1-2 sentence description>", 
      "category": "One of: ${Object.values(Category).join(', ')}", 
      "tags": ["<tag1>", "<tag2>"], 
      "yearEstablished": "<YYYY>", 
      "curatorNote": "Write a 2-3 sentence paragraph in your exact character's voice explaining why you selected this site and what you want the user to feel.",
      "designVibe": "<e.g. Minimalist Glitch>",
      "technicalStack": ["<tech1>", "<tech2>"],
      "vibeScore": <number 1-100>
    }]
  `;

  try {
    const response = await executeWithAutoRouter(prompt, model, thinkingBudget);
    return parseResponse(response.text);
  } catch (error) {
    console.error("Gemini discovery failed:", error);
    throw error;
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
  if (!ai) throw new Error("API_KEY_MISSING: Gemini API Key is missing.");

  const timeConstraint = timeEra.id === 'all' 
    ? "" 
    : `STRICT CONSTRAINT: Only find websites established between ${timeEra.range}, or websites that perfectly emulate the design aesthetic of that era. YOU MUST FOLLOW THIS ERA CONSTRAINT.`;

  const prompt = `
    SYSTEM PERSONA INITIALIZATION:
    =================================
    ${persona.promptModifier}
    =================================

    AESTHETIC & TIMELINE DIRECTIVES:
    =================================
    ${aesthetic.promptModifier}
    ${timeConstraint}
    =================================
    
    TASK FOREGROUNDING:
    You are NOT an AI assistant. You are exactly the persona described above inside the SYSTEM PERSONA INITIALIZATION. You must find ${count} REAL, UNIQUE websites explicitly matching the user's search query: "${query}".

    Rules:
    1. Must be real/online right now.
    2. No mainstream, boring, or generic corporate sites.
    3. The "curatorNote" MUST be written fully in character, projecting your entire bizarre personality onto the search results as described in your prompt modifier.

    Return JSON array in \`\`\`json format:
    [{ 
      "title": "<Actual Website Title>", 
      "url": "<Valid https:// URL>", 
      "description": "<Engaging 1-2 sentence description>", 
      "category": "One of: ${Object.values(Category).join(', ')}", 
      "tags": ["<tag1>", "<tag2>"], 
      "yearEstablished": "<YYYY>", 
      "curatorNote": "Write a 2-3 sentence paragraph in your exact character's twisted voice explaining why you selected this search result.",
      "designVibe": "<Thematic vibe>",
      "technicalStack": ["<tech1>"],
      "vibeScore": <number 1-100>
    }]
  `;

  try {
    const response = await executeWithAutoRouter(prompt, model, thinkingBudget);
    return parseResponse(response.text);
  } catch (error) {
    console.error("Gemini search failed:", error);
    throw error;
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
  if (!ai) throw new Error("API_KEY_MISSING: Gemini API Key is missing.");

  const timeConstraint = timeEra.id === 'all' 
    ? "" 
    : `STRICT CONSTRAINT: Only find websites established between ${timeEra.range}, or websites that perfectly emulate the design aesthetic of that era.`;

  const prompt = `
    SYSTEM PERSONA INITIALIZATION:
    =================================
    You are a deeply opinionated AI curator.
    =================================

    AESTHETIC & TIMELINE DIRECTIVES:
    =================================
    FILTER: Favor aesthetic: ${aesthetic.name}.
    ${timeConstraint}
    =================================
    
    Find ${count} websites SIMILAR to: "${title}" (${url}).
    Focus on structural similarity, weirdness, and the chosen aesthetic.

    Rules:
    1. Must be real/online right now.
    2. No mainstream, boring, or generic corporate sites.
    3. The "curatorNote" MUST be written in an obsessive, eccentric voice comparing the site to the original link.

    Return JSON array in \`\`\`json format:
    [{ 
      "title": "<Actual Website Title>", 
      "url": "<Valid https:// URL>", 
      "description": "<Engaging 1-2 sentence description>", 
      "category": "One of: ${Object.values(Category).join(', ')}", 
      "tags": ["<tag1>", "<tag2>"], 
      "yearEstablished": "<YYYY>", 
      "curatorNote": "Write a 2-3 sentence paragraph in an eccentric curator's voice explaining why this site is a worthy successor to the original.",
      "designVibe": "<Similar aesthetic>",
      "technicalStack": ["<tech1>"],
      "vibeScore": <number 1-100>
    }]
  `;

  try {
    const response = await executeWithAutoRouter(prompt, model, thinkingBudget);
    return parseResponse(response.text);
  } catch (error) {
    console.error("Gemini similarity search failed:", error);
    throw error;
  }
};

export const getSiteAnalysis = async (site: Site, persona: CuratorPersona, model: AIModel, thinkingBudget: number = 0, aesthetic: Aesthetic, timeEra: TimeEra): Promise<string> => {
    if (!ai) throw new Error("API_KEY_MISSING: Gemini API Key is missing.");
    
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
    } catch (e: any) {
        console.error("Analysis Error:", e);
        throw new Error(e.message || "Neural link severed. Analysis unavailable.");
    }
}