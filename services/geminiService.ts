import { Site, Category, CuratorPersona, AIModel, Aesthetic, TimeEra } from '../types';
import { GoogleGenAI } from "@google/genai";
import { AI_MODELS } from "../constants";

// Simple, non-crashing ID generator
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Safe access to API Key on the frontend
const getApiKey = () => {
    // Priority: User Input (Local Storage) > GEMINI_API_KEY > API_KEY > VITE_ Fallback
    let key = "";
    
    // Check local storage first (for site-specific overrides)
    try {
        const storedKey = window.localStorage.getItem('RABBIT_HOLE_API_KEY');
        if (storedKey) return storedKey;
    } catch (e) {
        // Ignore storage errors
    }

    try {
        // @ts-ignore
        key = process.env.GEMINI_API_KEY || (process.env as any).API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
    } catch (e) {
        try {
            key = (import.meta as any).env?.VITE_GEMINI_API_KEY || "";
        } catch (innerE) {
            // Silently fail
        }
    }
    
    // Minimal sanity check - only block obvious placeholder text like "TODO"
    // but allow things that might be valid keys even if they look weird
    if (key === "your_api_key_here" || key === "INSERT_KEY") {
        return "";
    }
    
    return key;
};

const executeWithRouter = async (
    prompt: string,
    model: AIModel,
    thinkingBudget: number,
    actionType: string = 'discover'
): Promise<{ text: string }> => {
    const apiKey = getApiKey();
    if (!apiKey) {
        throw new Error("Critical Connection Failure: The Rabbit Hole's neural link (Gemini API Key) is not configured. Please check your application settings.");
    }

    const ai = new GoogleGenAI({ apiKey });
    
    let currentModel = model;
    const modelsTried = new Set<string>();
    let retryLoops = 0;
    const MAX_RETRY_LOOPS = 3; 
    
    // Only consider models that support the 'text' modality (or default to text if undefined)
    const validTextModels = AI_MODELS.filter(m => !m.modalities || m.modalities.includes('text'));
    
    // Continue until we've exhausted all models and all retry loops
    while (retryLoops <= MAX_RETRY_LOOPS) {
        try {
            const baseConfig: any = {};
            // Research mode: Enable Google Search for discovery/search/similar if model is Gemini and supported
            if (actionType !== 'analysis' && currentModel.id.startsWith('gemini-')) {
                // gemini-2.5-flash-image specifically does not support searching
                if (currentModel.id !== 'gemini-2.5-flash-image') {
                    baseConfig.tools = [{ googleSearch: {} }];
                }
            }

            if (currentModel.supportsThinking && thinkingBudget > 0) {
                baseConfig.thinkingConfig = { includeThoughts: true };
            }

            const response = await ai.models.generateContent({
                model: currentModel.id,
                contents: prompt,
                config: baseConfig
            });

            return { text: response.text || "" };
        } catch (error: any) {
            const errorMsg = error.message?.toLowerCase() || "";
            const isQuotaError = error.status === 429 || 
                                 errorMsg.includes('429') || 
                                 errorMsg.includes('quota') ||
                                 errorMsg.includes('resource_exhausted') ||
                                 error.status === 503 ||
                                 errorMsg.includes('503');
            
            // Also failover if the model is not found or not supported in this region
            const isModelUnavailable = error.status === 404 || 
                                      errorMsg.includes('404') || 
                                      errorMsg.includes('model not found') ||
                                      errorMsg.includes('not supported') ||
                                      error.status === 403;

            if (isQuotaError || isModelUnavailable) {
                modelsTried.add(currentModel.id);
                
                // Find a model we haven't tried in this loop from the valid text models
                const fallbackModel = validTextModels.find(m => !modelsTried.has(m.id));
                
                if (fallbackModel) {
                    const reason = isQuotaError ? "rate limited" : "unavailable";
                    console.warn(`[AutoRouter] Model ${currentModel.id} ${reason}. Attempting failover to ${fallbackModel.id}`);
                    currentModel = fallbackModel;
                    continue; 
                } else {
                    // All valid text models exhausted in this loop
                    if (retryLoops < MAX_RETRY_LOOPS) {
                        retryLoops++;
                        const waitTime = 2000 * retryLoops;
                        console.warn(`[AutoRouter] All ${validTextModels.length} compatible models exhausted. Waiting ${waitTime}ms before Loop ${retryLoops+1}/${MAX_RETRY_LOOPS+1}...`);
                        await new Promise(r => setTimeout(r, waitTime));
                        modelsTried.clear();
                        currentModel = model; 
                        continue;
                    }
                }
            } else {
                if (errorMsg.includes("api key not valid") || error.status === 400) {
                    throw new Error("Neural Link Authentication Failure: The Gemini API Key is invalid or restricted.");
                }
                throw error;
            }
        }
    }
    
    throw new Error("Neural link failed: All available AI models have reached their rate limits. Please wait a few minutes or provide a fresh API key.");
};

const parseResponse = (text: string | undefined): Site[] => {
  if (!text || !text.trim()) return [];
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonString = jsonMatch ? jsonMatch[1] : text;
    
    // Find the first '[' and last ']' if it looks like a loose array
    if (!jsonMatch && !jsonString.trim().startsWith('[') && jsonString.includes('[')) {
        const first = jsonString.indexOf('[');
        const last = jsonString.lastIndexOf(']');
        if (first !== -1 && last !== -1) {
            jsonString = jsonString.substring(first, last + 1);
        }
    }

    const cleanText = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();
    if (!cleanText) return [];
    
    const parsedData = JSON.parse(cleanText);
    
    const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataArray.map((item: any) => ({
      title: item.title || "Unknown Terminal Site",
      url: item.url || "#",
      description: item.description || "No description available.",
      category: Object.values(Category).includes(item.category) ? item.category : Category.MYSTERY,
      tags: Array.isArray(item.tags) ? item.tags : [],
      yearEstablished: item.yearEstablished?.toString() || "",
      curatorNote: item.curatorNote || "Curator is silent.",
      designVibe: item.designVibe || "Unknown vibe",
      technicalStack: Array.isArray(item.technicalStack) ? item.technicalStack : [],
      vibeScore: typeof item.vibeScore === 'number' ? item.vibeScore : 50,
      id: generateId()
    }));
  } catch (error: any) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("PARSING_ERROR: Transmission garbled.");
  }
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
    const response = await executeWithRouter(prompt, model, thinkingBudget, 'discover');
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
    const response = await executeWithRouter(prompt, model, thinkingBudget, 'search');
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
    const response = await executeWithRouter(prompt, model, thinkingBudget, 'similar');
    return parseResponse(response.text);
  } catch (error) {
    console.error("Gemini similarity search failed:", error);
    throw error;
  }
};

export const getSiteAnalysis = async (site: Site, persona: CuratorPersona, model: AIModel, thinkingBudget: number = 0, aesthetic: Aesthetic, timeEra: TimeEra): Promise<string> => {
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
        const response = await executeWithRouter(prompt, model, thinkingBudget, 'analysis');
        return response.text || "Analysis failed.";
    } catch (e: any) {
        console.error("Analysis Error:", e);
        throw new Error(e.message || "Neural link severed. Analysis unavailable.");
    }
}