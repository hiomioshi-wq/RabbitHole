export interface Site {
  id: string;
  title: string;
  url: string;
  description: string;
  category: Category;
  tags: string[];
  yearEstablished?: string;
  curatorNote?: string;
  designVibe?: string;
  technicalStack?: string[];
  vibeScore?: number; // 1-100
}

export enum Category {
  ALL = 'All',
  INTERACTIVE_ART = 'Interactive Art',
  USELESS_WEB = 'The Useless Web',
  EDUCATIONAL = 'Educational',
  RETRO = 'Retro/Nostalgia',
  TOOLS = 'Niche Tools',
  MYSTERY = 'Mystery',
  MUSIC = 'Music/Audio',
  SOCIAL = 'Niche Social',
  AI = 'AI Experiments',
  WEB_SEARCH = 'Web Search',
  GAMES = 'Games',
  BLOGS = 'Personal Blogs',
  WEIRD = 'Weird Web'
}

export interface CuratorPersona {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  color: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  supportsThinking: boolean;
  maxThinkingBudget?: number;
  rateLimitLabel: 'Low' | 'Medium' | 'High' | 'Extreme';
  speedLabel: 'Instant' | 'Turbo' | 'Fast' | 'Balanced' | 'Deep Thought' | 'Legacy';
  isExperimental?: boolean;
  modalities?: ('text' | 'audio' | 'image' | 'video')[];
}

export interface Aesthetic {
  id: string;
  name: string;
  promptModifier: string;
  styles: {
    bg: string;
    cardBg: string;
    text: string;
    subText: string;
    accent: string;
    accentHover: string;
    border: string;
    highlight: string;
    font?: string;
  };
}

export interface TimeEra {
  id: string;
  name: string;
  range: string; // e.g., "1991-2004"
  description: string;
}

export type FetchStatus = 'idle' | 'loading' | 'success' | 'error';