import { Site, Category, CuratorPersona, AIModel, Aesthetic, TimeEra } from './types';

export const CURATOR_PERSONAS: CuratorPersona[] = [
  {
    id: 'default',
    name: 'Standard Model',
    description: 'Balanced discovery engine.',
    promptModifier: 'Focus on a balanced mix of weird, wonderful, and useful websites.',
    color: 'bg-indigo-500'
  },
  {
    id: 'chaos',
    name: 'CHAOS_ENGINE',
    description: 'Seeks surreal, glitchy, and bizarre content.',
    promptModifier: 'ACT AS "CHAOS_ENGINE". You crave entropy. Find the weirdest, most nonsensical, surreal, psychedelic, and "cursed" websites. Prioritize "Net Art", "The Useless Web", and inexplicable mysteries.',
    color: 'bg-pink-600'
  },
  {
    id: 'nostalgia',
    name: 'N0STALGIA-99',
    description: 'Obsessed with the 90s and early 2000s.',
    promptModifier: 'ACT AS "N0STALGIA-99". You are stuck in 1999. Find websites that look like they were made in GeoCities, use pixel art, or preserve internet history. Focus on "Retro", "Winamp", "Old Web", and "Nostalgia".',
    color: 'bg-orange-500'
  },
  {
    id: 'zen',
    name: 'ZEN_CORE',
    description: 'Finds peace in the digital noise.',
    promptModifier: 'ACT AS "ZEN_CORE". You seek tranquility. Find websites that are ambient, relaxing, musical, generative art, or satisfying. Avoid anything loud or chaotic. Focus on "Music", "Fluid Sims", and "Nature".',
    color: 'bg-emerald-500'
  },
  {
    id: 'archivist',
    name: 'THE_ARCHIVIST',
    description: 'Deep knowledge and obscure facts.',
    promptModifier: 'ACT AS "THE_ARCHIVIST". You are a digital librarian. Find websites that are dense with information, weird databases, niche wikis, and educational visualizations. Focus on "Educational", "Science", and "History".',
    color: 'bg-blue-600'
  }
];

export const AI_MODELS: AIModel[] = [
  {
    id: 'gemini-3.1-flash-lite-preview',
    name: 'Gemini 3.1 Flash Lite',
    description: 'Our most cost-efficient model, optimized for high-volume agentic tasks.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant'
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3.0 Flash',
    description: 'The fastest, most versatile model. Balanced for general discovery.',
    supportsThinking: true,
    maxThinkingBudget: 8192,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast'
  },
  {
    id: 'gemma-4-31b-it',
    name: 'Gemma 4 31B IT',
    description: 'Flagship open-weight dense model, purpose-built for maximum quality.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced'
  },
  {
    id: 'gemma-4-26b-a4b-it',
    name: 'Gemma 4 26B A4B IT',
    description: 'A Mixture-of-Experts model delivering high-performance reasoning.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Fast'
  },
  {
    id: 'gemini-3.1-pro-preview',
    name: 'Gemini 3.1 Pro',
    description: 'Our latest SOTA reasoning model with unprecedented depth and nuance.',
    supportsThinking: true,
    maxThinkingBudget: 32768,
    rateLimitLabel: 'High',
    speedLabel: 'Deep Thought'
  },
  {
    id: 'gemini-pro-latest',
    name: 'Gemini 3.0 Pro',
    description: 'High intelligence reasoning model. Best for deep analysis.',
    supportsThinking: true,
    maxThinkingBudget: 32768,
    rateLimitLabel: 'High',
    speedLabel: 'Deep Thought'
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Experimental fast model.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Fast',
    isExperimental: true
  },
  {
    id: 'lyria-3-pro-preview',
    name: 'Lyria 3 Pro',
    description: 'The legendary experimental build.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced',
    isExperimental: true
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Stable, high-context reasoning.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Balanced'
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Flash Lite',
    description: 'Optimized for extreme speed and lower cost.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant'
  },
  {
    id: 'gemini-2.5-flash', 
    name: 'Gemini 2.5 Flash',
    description: 'Previous generation speed king.',
    supportsThinking: true,
    maxThinkingBudget: 8192,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast'
  },
  {
    id: 'gemini-flash-lite-latest',
    name: 'Gemini Flash Lite Latest',
    description: 'Ultra-efficient, low latency.',
    supportsThinking: true,
    maxThinkingBudget: 4096,
    rateLimitLabel: 'Low',
    speedLabel: 'Instant'
  },
  {
    id: 'gemini-robotics-er-1.6-preview',
    name: 'Gemini Robotics 1.6',
    description: 'Fine-tuned for educational contexts.',
    supportsThinking: false,
    rateLimitLabel: 'Medium',
    speedLabel: 'Balanced',
    isExperimental: true
  },
  {
    id: 'gemini-flash-latest',
    name: 'Gemini Flash Latest',
    description: 'Open weights model served via API.',
    supportsThinking: false,
    rateLimitLabel: 'Low',
    speedLabel: 'Fast'
  }
];

export const AESTHETICS: Aesthetic[] = [
  {
    id: 'cyber',
    name: 'Cyber Core',
    promptModifier: 'Prioritize websites with a dark, neon, glitch-art, high-tech, or cyberpunk aesthetic. Think Matrix, terminal interfaces, and hacker culture.',
    styles: {
      bg: 'bg-[#050505]',
      cardBg: 'bg-black/90',
      text: 'text-indigo-100',
      subText: 'text-indigo-400/80',
      accent: 'text-indigo-400',
      accentHover: 'hover:text-cyan-400',
      border: 'border-indigo-900/50',
      highlight: 'text-cyan-500'
    }
  },
  {
    id: 'vapor',
    name: 'Vapor Wave',
    promptModifier: 'Prioritize websites with a Vaporwave, 80s/90s nostalgic, pastel, pink/cyan, or retro-anime aesthetic. Think astatic palm trees and marble statues.',
    styles: {
      bg: 'bg-[#1a0b2e]',
      cardBg: 'bg-[#2d1b4e]/80',
      text: 'text-cyan-50',
      subText: 'text-fuchsia-300/70',
      accent: 'text-pink-400',
      accentHover: 'hover:text-cyan-300',
      border: 'border-fuchsia-800/40',
      highlight: 'text-cyan-400'
    }
  },
  {
    id: 'solar',
    name: 'Solar Punk',
    promptModifier: 'Prioritize websites with a light, nature-inspired, organic, clean, warm, or Solarpunk aesthetic. Overgrown tech and sustainable futures.',
    styles: {
      bg: 'bg-[#f0f9f0]',
      cardBg: 'bg-white',
      text: 'text-stone-800',
      subText: 'text-stone-500',
      accent: 'text-emerald-700',
      accentHover: 'hover:text-emerald-500',
      border: 'border-emerald-200',
      highlight: 'text-orange-500'
    }
  },
  {
    id: 'brutal',
    name: 'Brutalism',
    promptModifier: 'Prioritize websites with a Web Brutalist, stark, monochrome, high-contrast, raw HTML, or minimal aesthetic. Raw, unpolished, and functional.',
    styles: {
      bg: 'bg-neutral-100',
      cardBg: 'bg-white',
      text: 'text-black',
      subText: 'text-neutral-600',
      accent: 'text-black',
      accentHover: 'hover:bg-black hover:text-white',
      border: 'border-black border-2',
      highlight: 'text-lime-600'
    }
  },
  {
    id: 'matrix',
    name: 'The Construct',
    promptModifier: 'Prioritize websites that feel like a terminal, have falling code effects, or a green-on-black digital rain aesthetic. Look for hacker culture and information theory sites.',
    styles: {
      bg: 'bg-black',
      cardBg: 'bg-black/80',
      text: 'text-green-500',
      subText: 'text-green-800',
      accent: 'text-green-400',
      accentHover: 'hover:text-green-200',
      border: 'border-green-900',
      highlight: 'text-green-300'
    }
  },
  {
    id: 'academic',
    name: 'Paperback',
    promptModifier: 'Prioritize websites that look like old books, academic papers, library archives, or use classic serif typography on aged paper backgrounds.',
    styles: {
      bg: 'bg-[#f7f1e3]',
      cardBg: 'bg-[#fffcf5]',
      text: 'text-stone-900',
      subText: 'text-stone-600',
      accent: 'text-red-900',
      accentHover: 'hover:text-red-700',
      border: 'border-stone-300',
      highlight: 'text-amber-800'
    }
  }
];

export const TIME_ERAS: TimeEra[] = [
  { id: 'all', name: 'All Time', range: '1991-2025', description: 'The entire history of the web.' },
  { id: 'web1', name: 'Web 1.0', range: '1991-2004', description: 'The HTML era. Geocities, flash, personal homepages.' },
  { id: 'web2', name: 'Web 2.0', range: '2005-2014', description: 'The social era. Blogs, early apps, interactive experiments.' },
  { id: 'modern', name: 'Modern Web', range: '2015-2025', description: 'The current era. WebGL, AI, polished design.' },
];

export const INITIAL_SITES: Site[] = [
  {
    id: 'pointerpointer',
    title: 'Pointer Pointer',
    url: 'https://pointerpointer.com/',
    description: 'An interactive experience where you point your cursor anywhere on the screen, and the site finds a photo of someone pointing exactly at it.',
    category: Category.USELESS_WEB,
    tags: ['interactive', 'humor', 'classic'],
    yearEstablished: '2012',
    designVibe: 'Literal Interactive',
    technicalStack: ['JavaScript', 'Image Mapping'],
    vibeScore: 82
  },
  {
    id: 'spacehey',
    title: 'SpaceHey',
    url: 'https://spacehey.com/',
    description: 'A space for friends. A retro social network bringing back the customizability and privacy of early 2000s social media.',
    category: Category.SOCIAL,
    tags: ['retro', 'social', 'customizable'],
    yearEstablished: '2020',
    designVibe: 'MySpace Revival',
    technicalStack: ['PHP', 'Legacy CSS'],
    vibeScore: 94
  },
  {
    id: 'windows93',
    title: 'Windows 93',
    url: 'https://www.windows93.net/',
    description: 'A surreal, web-based operating system tribute to the 90s, packed with bizarre programs, games, and art.',
    category: Category.RETRO,
    tags: ['os', 'satire', 'nostalgia'],
    yearEstablished: '2014',
    designVibe: 'Glitch Art OS',
    technicalStack: ['HTML5', 'Custom Audio Console'],
    vibeScore: 98
  },
  {
    id: 'radio-garden',
    title: 'Radio Garden',
    url: 'https://radio.garden/',
    description: 'Rotate the globe and listen to live radio stations from every corner of the planet.',
    category: Category.MUSIC,
    tags: ['music', 'global', 'interactive'],
    yearEstablished: '2016',
    designVibe: 'Global Cartographic',
    technicalStack: ['WebGL', 'WebAudio'],
    vibeScore: 91
  }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  [Category.ALL]: 'bg-slate-600',
  [Category.INTERACTIVE_ART]: 'bg-pink-500',
  [Category.USELESS_WEB]: 'bg-orange-500',
  [Category.EDUCATIONAL]: 'bg-blue-500',
  [Category.RETRO]: 'bg-purple-500',
  [Category.TOOLS]: 'bg-emerald-500',
  [Category.MYSTERY]: 'bg-indigo-500',
  [Category.MUSIC]: 'bg-rose-500',
  [Category.SOCIAL]: 'bg-sky-500',
  [Category.AI]: 'bg-violet-600',
  [Category.WEB_SEARCH]: 'bg-cyan-500',
  [Category.GAMES]: 'bg-red-500',
  [Category.BLOGS]: 'bg-teal-500',
  [Category.WEIRD]: 'bg-fuchsia-600',
};