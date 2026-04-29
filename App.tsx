import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Rabbit, History, Sparkles, AlertCircle, RefreshCw, X, ExternalLink, Heart, Tag, Search, Ghost, Music, Gamepad2, Palette, Monitor, Cpu, ChevronDown, Zap, Gauge, Clock, SwatchBook, BrainCircuit, Dices, Plus, Volume2, VolumeX, Play, Trash2, HelpCircle, Settings, Shuffle, PaintRoller, Terminal, User, Type, Map, BookOpen, Film, Eye, Archive, NotebookPen, FolderArchive, Download, FolderPlus, Upload, Database, Globe, Settings2, ShieldAlert, Bug, Minimize2, ListOrdered, HardDrive, Focus, Volume1 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { Site, Category, FetchStatus, CuratorPersona, AIModel, Aesthetic, TimeEra, Expedition } from './types';
import { INITIAL_SITES, CATEGORY_COLORS, CURATOR_PERSONAS, AI_MODELS, AESTHETICS, TIME_ERAS } from './constants';
import { fetchRecommendations, searchSites, findSimilarSites, getSiteAnalysis, generateTopicSummary } from './services/geminiService';
import { fetchFromWikiAPI } from './services/wikiService';
import { SiteCard } from './components/SiteCard';
import { GraphView } from './components/GraphView';

// --- Global Storage Helper for Sound ---
const isSoundEnabled = () => {
    try {
        const stored = window.localStorage.getItem('rabbithole_sound');
        return stored ? JSON.parse(stored) : true;
    } catch {
        return true;
    }
};

// --- Sound Engine ---
const playSound = (type: 'static' | 'blip' | 'success') => {
  try {
    if (!isSoundEnabled()) return;
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'static') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'blip') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.05);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'success') {
      const g2 = ctx.createGain();
      g2.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (e) {
    // Ignore audio errors
  }
};

// --- Hook for local storage ---
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  useEffect(() => {
    console.log("%c 🐇 RABBIT HOLE INITIALIZED ", "background: #6366f1; color: white; font-weight: bold; padding: 4px; border-radius: 4px;");
    console.log("%c Descending into the obscure web... ", "color: #818cf8; font-style: italic;");
  }, []);

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: React.SetStateAction<T>) => {
    try {
      const valueToStore = value instanceof Function ? (value as (val: T) => T)(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

const COLLECTIONS = [
  { id: 'maps', label: 'Places & Maps', icon: Map, query: 'weird obscure real world locations and map coordinates' },
  { id: 'spooky', label: 'Spooky', icon: Ghost, query: 'scary creepy unsettling websites' },
  { id: 'zen', label: 'Zen Mode', icon: Music, query: 'relaxing ambient peaceful interactive websites' },
  { id: 'retro', label: '90s Web', icon: Gamepad2, query: '90s geocities nostalgia web design' },
  { id: 'books', label: 'E-Lit & Lore', icon: BookOpen, query: 'digital literature lore and interactive narratives' },
  { id: 'media', label: 'Lost Media', icon: Film, query: 'forgotten obscure media and archives' },
  { id: 'mystery', label: 'Conspiracies', icon: Eye, query: 'weird web mysteries and rabbit holes' },
  { id: 'software', label: 'Old Software', icon: Archive, query: 'retro software emulators and archives' },
  { id: 'art', label: 'Net Art', icon: Palette, query: 'weird internet art experiments' },
  { id: 'ai', label: 'AI Wonders', icon: BrainCircuit, query: 'best obscure ai experiments and tools' },
  { id: 'search', label: 'Web Search', icon: Search, query: 'obscure search engines and directories' },
  { id: 'games', label: 'Games', icon: Dices, query: 'weird obscure browser games' },
];

const MatrixRain: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        const columns = Math.floor(width / 20);
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";
        const drops: number[] = new Array(columns).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#0f0';
            ctx.font = '15pt monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(text, i * 20, drops[i] * 20);

                if (drops[i] * 20 > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);
        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            drops.length = Math.floor(width / 20);
            drops.fill(1);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-20 z-0" />;
};

const App: React.FC = () => {
  // State
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.ALL);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [retroMode, setRetroMode] = useLocalStorage('retro_mode', true);
  
  // AI Model & Config State
  const [activePersona, setActivePersona] = useState<CuratorPersona>(CURATOR_PERSONAS[0]);
  const [activeModel, setActiveModel] = useState<AIModel>(AI_MODELS[0]);
  const [thinkingBudget, setThinkingBudget] = useState<number>(0);
  const [activeAesthetic, setActiveAesthetic] = useState<Aesthetic>(AESTHETICS[0]);
  const [activeEra, setActiveEra] = useState<TimeEra>(TIME_ERAS[0]);
  
  const [searchResults, setSearchResults] = useState<Site[] | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'classic' | 'graph'>('classic');
  const [showConfig, setShowConfig] = useState(false);
  const [loadingAction, setLoadingAction] = useState<'search' | 'stumble' | 'similar'>('stumble');
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [history, setHistory] = useLocalStorage<Site[]>('rabbithole_history', []);
  const [favorites, setFavorites] = useLocalStorage<Site[]>('rabbithole_favorites', []);
  const [expeditions, setExpeditions] = useLocalStorage<Expedition[]>('rabbithole_expeditions', []);
  const [isArchivesOpen, setIsArchivesOpen] = useState(false);
  const [siteQueue, setSiteQueue] = useState<Site[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAdvancedSettingsOpen, setIsAdvancedSettingsOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submittedSites, setSubmittedSites] = useLocalStorage<any[]>('rabbithole_submissions', []);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('rabbithole_sound', true);
  
  // Advanced Settings State
  const [autoSpeak, setAutoSpeak] = useLocalStorage('rabbithole_autospeak', false);
  const [compactMode, setCompactMode] = useLocalStorage('rabbithole_compact', false);
  const [safeSearch, setSafeSearch] = useLocalStorage('rabbithole_safesearch', true);
  const [showDebugStats, setShowDebugStats] = useLocalStorage('rabbithole_debug', false);
  const [reducedMotion, setReducedMotion] = useLocalStorage('rabbithole_reducedmotion', false);
  const [maxQueueDepth, setMaxQueueDepth] = useLocalStorage('rabbithole_queuedepth', 10);
  const [dataSource, setDataSource] = useLocalStorage<'gemini' | 'wikipedia' | 'miraheze'>('rabbithole_datasource', 'gemini');
  const [searchEngineMode, setSearchEngineMode] = useLocalStorage('rabbithole_searchengine', false);
  
  const [autoStumble, setAutoStumble] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const addToHistory = (site: Site) => {
    setHistory(prev => {
      if (prev.length > 0 && prev[0].id === site.id) return prev;
      return [site, ...prev].slice(0, 50);
    });
  };

  const handleBack = () => {
      if (history.length > 1) {
          // Remove the current one from history to "go back"
          const previousSite = history[1];
          setHistory(prev => prev.slice(1));
          setCurrentSite(previousSite);
          playSound('blip');
      }
  };

  const toggleFavorite = (site: Site) => {
    setFavorites(prev => {
      const exists = prev.find(s => s.id === site.id);
      if (exists) {
        return prev.filter(s => s.id !== site.id);
      }
      return [site, ...prev];
    });
  };

  const handleUpdateSite = (updatedSite: Site) => {
    // Update in favorites
    setFavorites(prev => prev.map(s => s.id === updatedSite.id ? updatedSite : s));
    
    // Update in current view
    if (currentSite?.id === updatedSite.id) {
        setCurrentSite(updatedSite);
    }
    
    // Update in history if exists
    setHistory(prev => prev.map(s => s.id === updatedSite.id ? updatedSite : s));
  };

  const exportExpeditionMarkdown = (expeditionId: string | 'all') => {
    const sites = expeditionId === 'all' 
        ? favorites 
        : favorites.filter(s => s.expeditionId === expeditionId);
    
    const expedition = expeditions.find(e => e.id === expeditionId);
    const title = expedition ? expedition.name : 'Full Collections';
    
    let md = `# Research Dossier: ${title}\n`;
    md += `Generated: ${new Date().toLocaleDateString()} | Rabbit Hole Terminal\n\n`;
    
    sites.forEach(site => {
        md += `## ${site.title}\n`;
        md += `URL: ${site.url}\n`;
        md += `Category: ${site.category}\n\n`;
        md += `### Assistant's Note\n${site.curatorNote || 'No record.'}\n\n`;
        if (site.fieldNote) {
            md += `### Personal Observations\n${site.fieldNote}\n\n`;
        }
        md += `---\n\n`;
    });
    
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dossier-${title.toLowerCase().replace(/\s+/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  const exportAllData = () => {
    const data = { history, favorites, expeditions, submittedSites };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rabbithole-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    playSound('success');
  };

  const importAllData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.history) setHistory(data.history);
        if (data.favorites) setFavorites(data.favorites);
        if (data.expeditions) setExpeditions(data.expeditions);
        if (data.submittedSites) setSubmittedSites(data.submittedSites);
        playSound('success');
        alert("Data successfully imported!");
      } catch (err) {
        alert("Invalid backup file.");
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const bulkEnqueueUrls = () => {
    const input = prompt("Paste URLs separated by lines or commas to add to queue:");
    if (!input) return;
    
    const urls = input.split(/[\n,]+/).map(u => u.trim()).filter(u => u.startsWith('http'));
    if (urls.length === 0) {
        alert("No valid URLs found.");
        return;
    }
    
    const newSites: Site[] = urls.map(url => ({
        id: Math.random().toString(36).substr(2, 9),
        title: new URL(url).hostname,
        url,
        description: "Manually injected web node. Proceed with caution.",
        category: Category.ALL,
        tags: ["injected", "manual"],
        curatorNote: "Anomalous manual entry injected by user."
    }));
    
    setSiteQueue(prev => [...prev, ...newSites]);
    playSound('success');
    alert(`Enqueued ${newSites.length} nodes for exploration.`);
  };

  const randomizeConfig = () => {
    const randomPersona = CURATOR_PERSONAS[Math.floor(Math.random() * CURATOR_PERSONAS.length)];
    const randomModel = AI_MODELS[Math.floor(Math.random() * AI_MODELS.length)];
    const randomAesthetic = AESTHETICS[Math.floor(Math.random() * AESTHETICS.length)];
    const randomEra = TIME_ERAS[Math.floor(Math.random() * TIME_ERAS.length)];
    
    setActivePersona(randomPersona);
    setActiveModel(randomModel);
    setActiveAesthetic(randomAesthetic);
    setActiveEra(randomEra);
    
    // Set a random thinking budget if supported
    if (randomModel.supportsThinking) {
        const max = randomModel.maxThinkingBudget || 4096;
        setThinkingBudget(Math.floor(Math.random() * (max / 1024)) * 1024);
    } else {
        setThinkingBudget(0);
    }
    
    playSound('blip');
  };

  const fetchMoreSites = useCallback(async (category: Category) => {
    try {
      let newSites: Site[] = [];
      if (dataSource === 'wikipedia' || dataSource === 'miraheze') {
          newSites = await fetchFromWikiAPI(dataSource, maxQueueDepth, selectedTag);
      } else {
          newSites = await fetchRecommendations(category, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, maxQueueDepth, selectedTag, safeSearch);
      }
      
      setSiteQueue(prev => {
        const combined = [...prev, ...newSites];
        return combined.slice(0, maxQueueDepth);
      });
    } catch (e) {
      console.warn("Background fetch failed", e);
    }
  }, [activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, selectedTag, maxQueueDepth, safeSearch, dataSource]); 

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const q = overrideQuery || searchQuery;
    if (!q.trim()) return;

    if (overrideQuery) setSearchQuery(overrideQuery);

    playSound('static');
    setStatus('loading');
    setLoadingAction('search');
    setShowWelcome(false);
    setIsSearchActive(true);
    setCurrentAnalysis(null);
    setSiteQueue([]); 
    setSearchResults(null);
    setAiSummary(null);

    try {
      let results: Site[] = [];
      if (dataSource === 'wikipedia' || dataSource === 'miraheze') {
          results = await fetchFromWikiAPI(dataSource, 15, q);
      } else {
          results = await searchSites(q, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, 15, safeSearch);
      }
      
      // FALLBACK
      if (results.length === 0) {
          const lowerQ = q.toLowerCase();
          const localResults = INITIAL_SITES.filter(s => 
             s.title.toLowerCase().includes(lowerQ) || 
             s.description.toLowerCase().includes(lowerQ) ||
             s.tags.some(t => t.toLowerCase().includes(lowerQ)) ||
             s.category.toLowerCase().includes(lowerQ)
          );
          results = localResults.sort(() => 0.5 - Math.random()).slice(0, 12);
      }

      if (results.length > 0) {
        playSound('success');
        setSearchResults(results);
        setStatus('success');
        
        // Asynchronously fetch AI summary
        if (dataSource === 'gemini') {
            generateTopicSummary(q, results, activeModel).then(summary => setAiSummary(summary));
        } else {
            generateTopicSummary(q, results, AI_MODELS[0]).then(summary => setAiSummary(summary));
        }
      } else {
        setStatus('idle');
        setSearchQuery("");
      }
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || "An unknown anomaly occurred during lookup.");
      setStatus('error');
    }
  };

  const selectSearchResult = (site: Site) => {
    playSound('success');
    setCurrentSite(site);
    addToHistory(site);
    
    if (searchResults) {
        const rest = searchResults.filter(s => s.id !== site.id);
        setSiteQueue(rest);
    }
    
    setSearchResults(null);
  };

  const handleFindSimilar = async (site: Site) => {
    playSound('static');
    setStatus('loading');
    setLoadingAction('similar');
    setSiteQueue([]);
    setCurrentAnalysis(null);
    setIsSearchActive(true);
    setSearchQuery(`Similar to: ${site.title}`);
    
    try {
      let results: Site[] = [];
      if (dataSource === 'wikipedia' || dataSource === 'miraheze') {
          // just pull random entries for 'similar' if using basic wiki API
          results = await fetchFromWikiAPI(dataSource, maxQueueDepth, site.tags[0] || site.title);
      } else {
          results = await findSimilarSites(site.url, site.title, activeModel, thinkingBudget, activeAesthetic, activeEra, maxQueueDepth, safeSearch);
      }
      
      if (results.length === 0) {
          const localResults = INITIAL_SITES.filter(s => 
              s.id !== site.id && 
              (s.category === site.category || s.tags.some(t => site.tags.includes(t)))
          );
          results = localResults.sort(() => 0.5 - Math.random()).slice(0, 3);
      }

      if (results.length > 0) {
        playSound('success');
        const first = results[0];
        const rest = results.slice(1);
        setCurrentSite(first);
        addToHistory(first);
        setSiteQueue(rest);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err: any) {
        console.error(err);
        setGlobalError(err.message || "An unknown anomaly occurred during lookup.");
        setStatus('error');
    }
  };

  const handleAnalyzeSite = async (site: Site) => {
      setIsAnalyzing(true);
      setCurrentAnalysis(null);
      try {
          const analysis = await getSiteAnalysis(site, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra);
          setCurrentAnalysis(analysis);
      } catch (e: any) {
          setCurrentAnalysis(e.message || "Connection failed. Local analysis unavailable.");
      } finally {
          setIsAnalyzing(false);
      }
  }

  const fallbackStumble = useCallback(() => {
    const available = INITIAL_SITES.filter(s => {
       const categoryMatch = selectedCategory === Category.ALL || s.category === selectedCategory;
       const tagMatch = selectedTag ? s.tags.includes(selectedTag) : true;
       const notCurrent = currentSite ? s.id !== currentSite.id : true;
       return categoryMatch && tagMatch && notCurrent;
    });
    
    if (available.length === 0) {
       const relaxed = INITIAL_SITES.filter(s => {
          const categoryMatch = selectedCategory === Category.ALL || s.category === selectedCategory;
          const tagMatch = selectedTag ? s.tags.includes(selectedTag) : true;
          return categoryMatch && tagMatch;
       });

       if (relaxed.length === 0) {
         if (selectedTag) {
           setSelectedTag(null); 
           const random = INITIAL_SITES[Math.floor(Math.random() * INITIAL_SITES.length)];
           setCurrentSite(random);
           addToHistory(random);
           playSound('success');
           setStatus('success');
         }
         return;
       }
       
       const random = relaxed[Math.floor(Math.random() * relaxed.length)];
       setCurrentSite(random);
       addToHistory(random);
       playSound('success');
       setStatus('success');
       return;
    }

    const random = available[Math.floor(Math.random() * available.length)];
    setCurrentSite(random);
    addToHistory(random);
    playSound('success');
    setStatus('success');
  }, [selectedCategory, selectedTag, currentSite, addToHistory]);

  const handleStumble = useCallback(async () => {
    playSound('static');
    setStatus('loading');
    setLoadingAction('stumble');
    setShowWelcome(false);
    setCurrentAnalysis(null);
    setSearchResults(null);
    
    if (isSearchActive && siteQueue.length > 0) {
        const nextSite = siteQueue[0];
        setSiteQueue(prev => prev.slice(1));
        setCurrentSite(nextSite);
        addToHistory(nextSite);
        playSound('success');
        setStatus('success');
        return;
    } else if (isSearchActive && siteQueue.length === 0) {
        if (searchQuery.startsWith('Similar to:')) {
             await handleSearch(undefined, searchQuery.replace('Similar to:', 'websites like'));
        } else {
             await handleSearch(undefined, searchQuery); 
        }
        return;
    }

    if (siteQueue.length > 0) {
      const nextSite = siteQueue[0];
      setSiteQueue(prev => prev.slice(1));
      setCurrentSite(nextSite);
      addToHistory(nextSite);
      playSound('success');
      setStatus('success');
      
      if (siteQueue.length < 5) {
        fetchMoreSites(selectedCategory);
      }
      return;
    }

    try {
      let newSites: Site[] = [];
      if (dataSource === 'wikipedia' || dataSource === 'miraheze') {
          newSites = await fetchFromWikiAPI(dataSource, maxQueueDepth, selectedTag);
      } else {
          newSites = await fetchRecommendations(selectedCategory, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, maxQueueDepth, selectedTag, safeSearch);
      }
      if (newSites.length > 0) {
        const first = newSites[0];
        const rest = newSites.slice(1);
        setCurrentSite(first);
        addToHistory(first);
        setSiteQueue(rest);
        playSound('success');
        setStatus('success');
      } else {
        fallbackStumble();
      }
    } catch (e: any) {
      console.error(e);
      if (e.message) {
         setGlobalError(e.message);
      }
      fallbackStumble();
    }
  }, [selectedCategory, selectedTag, siteQueue, fallbackStumble, fetchMoreSites, addToHistory, isSearchActive, searchQuery, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, safeSearch, maxQueueDepth, dataSource]); // handleSearch intentionally omitted to prevent circular dependency unless memoized properly, but we can safely call it using the current state values inside the callback.

  useEffect(() => {
    setSiteQueue([]);
  }, [activePersona, activeModel, activeAesthetic, activeEra]);

  const WebLoading = () => {
    let title = "GATHERING";
    let subtitle = `Browsing ${activeEra.name} websites`;
    
    if (loadingAction === 'search') {
        title = "SEARCHING";
        subtitle = `Searching for "${searchQuery}"`;
    } else if (loadingAction === 'similar') {
        title = "ANALYZING";
        subtitle = `Finding similar websites`;
    } else if (loadingAction === 'stumble') {
        title = "EXPLORING";
        subtitle = `Finding a suggestion in ${selectedCategory !== Category.ALL ? selectedCategory : 'all categories'}`;
    }

    return (
      <motion.div 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         className={`text-center relative flex flex-col items-center ${activeAesthetic.styles.font || 'font-sans'}`}
      >
         <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center">
            {/* Outer Rotating Ring */}
            <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ duration: 8, ease: "linear", repeat: Infinity }}
               className={`absolute inset-0 rounded-full border border-dashed ${activeAesthetic.styles.border} opacity-50`} 
            />
            {/* Inner Counter-Rotating Ring */}
            <motion.div 
               animate={{ rotate: -360 }} 
               transition={{ duration: 12, ease: "linear", repeat: Infinity }}
               className={`absolute inset-4 rounded-full border-t flex-1 ${activeAesthetic.styles.border}`} 
            />
            {/* Core Pulse */}
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} 
               transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
               className={`absolute w-16 h-16 rounded-full blur-xl ${activeAesthetic.styles.highlight.replace('text-', 'bg-')}`} 
            />
            {/* Icon */}
            <div className="relative z-10 glass-pill p-4">
               {loadingAction === 'search' ? <Search className={activeAesthetic.styles.accent} size={32} /> : 
                loadingAction === 'similar' ? <Shuffle className={activeAesthetic.styles.accent} size={32} /> : 
                <BrainCircuit className={activeAesthetic.styles.accent} size={32} />}
            </div>
         </div>
         
         <div className="space-y-4 max-w-sm w-full mx-auto">
            <motion.div 
               animate={{ opacity: [0.4, 1, 0.4] }} 
               transition={{ duration: 1.5, repeat: Infinity }}
               className={`font-display text-2xl tracking-[0.3em] font-black uppercase text-glow ${activeAesthetic.styles.text}`}
            >
               {title}
            </motion.div>
            
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative">
               <motion.div 
                   initial={{ width: "0%" }}
                   animate={{ width: "100%" }}
                   transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                   className={`absolute inset-y-0 left-0 ${activeAesthetic.styles.accent.replace('text-', 'bg-')}`}
               />
            </div>

            <p className={`${activeAesthetic.styles.subText} text-[10px] font-mono uppercase tracking-widest flex items-center justify-center gap-2`}>
               <RefreshCw size={10} className="animate-spin" /> {subtitle}
            </p>
            
            {activeModel.supportsThinking && thinkingBudget > 0 && (
               <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full glass-panel`}
               >
                  <Zap size={10} className={`${activeAesthetic.styles.highlight} animate-pulse`} />
                  <span className={`text-[9px] font-mono tracking-widest ${activeAesthetic.styles.text}`}>COMPUTING: {thinkingBudget} FLOPs</span>
               </motion.div>
            )}
         </div>
      </motion.div>
    );
  };

  // Auto Stumble Logic
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (autoStumble && status !== 'loading' && currentSite) {
        timer = setTimeout(() => {
            handleStumble();
        }, 15000); // 15 seconds auto-stumble
    }
    return () => clearTimeout(timer);
  }, [autoStumble, status, currentSite, handleStumble]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger hotkeys if user is tying in an input
      const activeEl = document.activeElement;
      const isInput = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
      
      if (e.key === '?' && !isInput) {
          e.preventDefault();
          setIsHelpModalOpen(prev => !prev);
          return;
      }

      if (e.key === '/' && !isSidebarOpen && !isInput) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      if ((e.code === 'Space' || e.code === 'ArrowRight') && !isSidebarOpen && !isInput) {
         e.preventDefault();
         if (status !== 'loading') {
            handleStumble();
         }
      }

      if ((e.code === 'ArrowLeft') && !isSidebarOpen && !isInput) {
         e.preventDefault();
         handleBack();
      }

      if (e.key.toLowerCase() === 'm' && !isInput) {
          e.preventDefault();
          setSoundEnabled(prev => !prev);
      }

      if (e.key.toLowerCase() === 'f' && !isInput && currentSite) {
          e.preventDefault();
          toggleFavorite(currentSite);
          playSound('blip');
      }

      if (e.key.toLowerCase() === 'q' && !isInput) {
          e.preventDefault();
          setSiteQueue([]);
          playSound('static');
      }

      if (e.key.toLowerCase() === 'a' && !isInput && currentSite && !isAnalyzing) {
          e.preventDefault();
          const pSite = currentSite; 
          // Needs manual event fire, handleAnalyzeSite relies on event passing. We can just call it straight or ignore 'a' if handleAnalyze is hard.
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStumble, handleBack, isSidebarOpen, status, currentSite, isAnalyzing, setSoundEnabled]);

  useEffect(() => {
    setSiteQueue([]);
    if (isSearchActive) {
      setIsSearchActive(false);
      setSearchQuery('');
    }
  }, [selectedCategory]);

  const handleTagClick = (tag: string) => {
    playSound('blip');
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      setIsSearchActive(false); 
      setSearchQuery('');
      setSiteQueue([]);
    }
  };

  return (
    <div className={`min-h-screen ${activeAesthetic.styles.bg} ${activeAesthetic.styles.text} ${activeAesthetic.styles.font || 'font-sans'} transition-colors duration-700 flex flex-col relative overflow-hidden`}>
      
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>

      {/* Matrix Rain Effect */}
      {activeAesthetic.id === 'matrix' && <MatrixRain />}

      {/* Grid Effect for technical aesthetics */}
      {(activeAesthetic.id === 'cyber' || activeAesthetic.id === 'circuit' || activeAesthetic.id === 'industrial') && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(${activeAesthetic.styles.accent.replace('text-', '')} 1px, transparent 0)`, backgroundSize: '40px 40px' }}></div>
      )}

      {/* CRT Scanline Effect */}
      {retroMode && (
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.07] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]">
          <div className="absolute inset-0 animate-pulse bg-white/5 mix-blend-overlay"></div>
        </div>
      )}
      
      {/* 8-Bit Pixel Grid */}
      {activeAesthetic.id === 'pixel' && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '4px 4px', backgroundPosition: '0 0, 2px 2px' }}></div>
      )}

      {/* Loading Static Overlay */}
      {status === 'loading' && (
        <div className="fixed inset-0 pointer-events-none z-40 opacity-10 animate-pulse bg-white mix-blend-overlay"></div>
      )}

      {/* Floating Nano-Header */}
      <header className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 glass-pill px-6 py-3 flex items-center justify-between gap-6 transition-all duration-500 w-[95%] max-w-4xl`}>
         <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => { setShowWelcome(true); playSound('blip'); }}>
            <div className={`p-1.5 rounded-full ${activeAesthetic.id === 'solar' ? 'bg-emerald-600 text-white' : activeAesthetic.id === 'vapor' ? 'bg-fuchsia-600 text-white' : activeAesthetic.id === 'brutal' ? 'bg-lime-600 text-black' : 'bg-indigo-600 text-white'}`}>
              <Rabbit size={20} />
            </div>
            <span className={`font-display font-bold text-lg tracking-tight hidden sm:block ${activeAesthetic.styles.text}`}>
              R<span className={activeAesthetic.styles.accent}>H</span>
            </span>
         </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className={`${activeAesthetic.styles.subText} group-focus-within:${activeAesthetic.styles.accent}`} />
              </div>
              <form onSubmit={(e) => handleSearch(e)} className="w-full">
                <input 
                  ref={searchInputRef}
                  type="text" 
                  placeholder={`Search ${activePersona.name}...`} 
                  className={`w-full bg-white/5 border border-white/10 ${activeAesthetic.styles.text} text-xs sm:text-sm rounded-full focus:bg-white/10 focus:ring-1 focus:ring-current focus:border-transparent block pl-9 p-1.5 sm:p-2 transition-all outline-none backdrop-blur-md`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
          </div>

         {/* Actions */}
         <div className="flex items-center gap-2 flex-shrink-0 relative">
            <button onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-full transition-colors glass-panel hover:bg-white/10 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`} title="Open Research Library">
                 <FolderArchive size={18} />
             </button>

            <div className={`hidden lg:flex items-center mr-2 px-3 py-1 rounded-full border ${activeAesthetic.styles.border} bg-white/5`}>
                <span className={`text-[9px] font-mono font-bold ${activeAesthetic.styles.text} flex items-center gap-2`}>
                   QUEUE <span className={activeAesthetic.styles.accent}>{siteQueue.length}</span>
                </span>
            </div>

            <button onClick={() => setShowConfig(!showConfig)} className={`p-2 rounded-full transition-colors glass-panel hover:bg-white/10 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`} title="Assistant Configuration">
                 <Settings size={18} />
             </button>

            <button onClick={() => setIsAdvancedSettingsOpen(!isAdvancedSettingsOpen)} className={`p-2 rounded-full transition-colors glass-panel hover:bg-white/10 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`} title="Advanced Settings">
                 <Settings2 size={18} />
             </button>
             
             <AnimatePresence>
             {showConfig && (
                 <>
                     <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
                        onClick={() => setShowConfig(false)}
                     ></motion.div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-[120%] right-0 w-[90vw] max-w-sm glass-panel rounded-2xl shadow-2xl z-50 p-6 overscroll-contain max-h-[80vh] overflow-y-auto custom-scrollbar border-white/20 backdrop-blur-3xl bg-black/80 origin-top-right text-left"
                     >
                         <div className="flex justify-between items-center mb-6 text-left">
                             <div className="flex flex-col">
                                <h3 className={`font-display font-medium text-xs tracking-widest uppercase ${activeAesthetic.styles.subText}`}>Terminal Interface</h3>
                                <h2 className={`text-xl font-bold font-display ${activeAesthetic.styles.text}`}>Configuration</h2>
                             </div>
                             <button onClick={() => setShowConfig(false)} className={`${activeAesthetic.styles.subText} hover:text-white p-2`}><X size={20}/></button>
                         </div>

                         {/* Actions Component */}
                         <div className="grid grid-cols-2 gap-2 mb-6">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={randomizeConfig} className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${activeAesthetic.styles.border} hover:bg-white/10 transition-all ${activeAesthetic.styles.text} text-[10px] font-bold uppercase tracking-wider`}>
                                <Shuffle size={14} className={activeAesthetic.styles.accent} /> Roll Dice
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setRetroMode(!retroMode); playSound('blip'); }} className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${activeAesthetic.styles.border} transition-all ${retroMode ? `bg-white/20 ${activeAesthetic.styles.accent}` : `hover:bg-white/10 ${activeAesthetic.styles.text}`} text-[10px] font-bold uppercase tracking-wider`}>
                                <Monitor size={14} /> Screen FX
                            </motion.button>
                         </div>

                         {/* Aesthetic Selector */}
                         <div className={`mb-8 text-left`}>
                             <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] mb-4 flex items-center gap-2 pr-2`}>
                                <PaintRoller size={12}/> 01. Visual Aesthetics
                                <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
                             </div>
                             <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                 {AESTHETICS.map(a => (
                                     <motion.button
                                         key={a.id}
                                         onClick={() => { setActiveAesthetic(a); playSound('blip'); }}
                                         className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${activeAesthetic.id === a.id ? `${a.styles.border} bg-white/20 ${a.styles.text}` : `border-transparent bg-white/5 hover:bg-white/10 ${activeAesthetic.styles.subText}`}`}
                                     >
                                         <div className={`w-8 h-8 rounded-lg ${a.styles.bg} border ${a.styles.border} flex items-center justify-center shrink-0 shadow-inner`}>
                                            <div className={`w-3 h-3 rounded-full ${a.styles.accent.replace('text-', 'bg-')}`}></div>
                                         </div>
                                         <div className="flex-1 text-left">
                                            <span className="text-[11px] font-bold block">{a.name}</span>
                                            <span className={`text-[8px] uppercase tracking-tighter opacity-70 block ${a.styles.font || 'font-sans'}`}>Font: {a.styles.font || 'default'}</span>
                                         </div>
                                         {activeAesthetic.id === a.id && <div className={`w-1.5 h-1.5 rounded-full ${a.styles.highlight.replace('text-', 'bg-')} shadow-[0_0_8px_rgba(255,255,255,0.5)]`}></div>}
                                     </motion.button>
                                 ))}
                             </div>
                         </div>

                         {/* Era Selector (Time Travel) */}
                         <div className={`mb-8 text-left`}>
                             <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] mb-4 flex items-center gap-2 pr-2`}>
                                <Clock size={12}/> 02. Time Travel Filter
                                <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
                             </div>
                             <div className="grid grid-cols-2 gap-2">
                                 {TIME_ERAS.map(era => (
                                     <motion.button
                                         whileHover={{ scale: 1.05 }}
                                         whileTap={{ scale: 0.95 }}
                                         key={era.id}
                                         onClick={() => { setActiveEra(era); playSound('blip'); }}
                                         className={`px-3 py-3 rounded-xl text-[10px] border transition-all font-mono tracking-wider uppercase text-left relative overflow-hidden group ${activeEra.id === era.id ? `${activeAesthetic.styles.border} bg-white/20 ${activeAesthetic.styles.text}` : `border-transparent bg-white/5 hover:bg-white/10 ${activeAesthetic.styles.subText}`}`}
                                     >
                                         <span className="block font-bold mb-0.5">{era.name}</span>
                                         <span className="block text-[8px] opacity-60 tracking-normal italic truncate font-sans">{era.range}</span>
                                         {activeEra.id === era.id && <div className={`absolute top-0 right-0 py-0.5 px-1.5 text-[7px] font-black uppercase tracking-tighter bg-current text-black`}>ACTIVE</div>}
                                     </motion.button>
                                 ))}
                             </div>
                             <p className={`mt-3 text-[9px] ${activeAesthetic.styles.subText} italic opacity-60 font-mono text-center`}>
                                * Influences neural search results priority.
                             </p>
                         </div>

                         {/* Persona Selector */}
                         <div className={`mb-8 text-left`}>
                             <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] mb-4 flex items-center gap-2 pr-2`}>
                                <Terminal size={12} /> 03. Assistant Personas
                                <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
                             </div>
                             <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {CURATOR_PERSONAS.map(persona => (
                                    <motion.button
                                        key={persona.id}
                                        onClick={() => { setActivePersona(persona); playSound('blip'); }}
                                        className={`w-full text-left p-4 rounded-xl transition-all border group ${activePersona.id === persona.id ? `${activeAesthetic.styles.border} bg-white/20` : `border-transparent bg-white/5 hover:bg-white/10`}`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className={`w-8 h-8 rounded-full ${persona.color} flex items-center justify-center shrink-0 shadow-lg border-2 border-white/10`}>
                                                <User size={14} className="text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className={`font-bold text-[11px] uppercase tracking-wider ${activePersona.id === persona.id ? activeAesthetic.styles.text : activeAesthetic.styles.subText}`}>
                                                    {persona.name}
                                                </div>
                                                <div className={`text-[9px] mt-1 leading-relaxed ${activeAesthetic.styles.subText} opacity-80 font-mono line-clamp-1`}>
                                                    {persona.description}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.button>
                                ))}
                             </div>
                         </div>

                         {/* Model Selector */}
                         <div className={`mb-8 text-left`}>
                             <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] mb-4 flex items-center gap-2 pr-2`}>
                                <Cpu size={12} /> 04. AI Engine
                                <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
                             </div>
                             <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {AI_MODELS.map(model => (
                                    <motion.button
                                        key={model.id}
                                        onClick={() => { setActiveModel(model); playSound('blip'); }}
                                        className={`w-full text-left p-3 rounded-xl transition-all border ${activeModel.id === model.id ? `${activeAesthetic.styles.border} bg-white/20 ${activeAesthetic.styles.highlight}` : `border-transparent bg-white/5 hover:bg-white/10 ${activeAesthetic.styles.subText}`}`}
                                    >
                                        <div className="flex justify-between items-center h-6">
                                            <span className="font-bold flex items-center gap-2 text-[11px] truncate">
                                                {model.name}
                                                {model.isExperimental && <span className="text-[7px] bg-purple-500/50 px-1 rounded text-white font-black">EXP</span>}
                                            </span>
                                            {activeModel.id === model.id && (
                                                <motion.div layoutId="engine-active" className="flex items-center gap-1">
                                                    <div className="w-1 h-1 rounded-full bg-current animate-ping"></div>
                                                    <span className="text-[8px] font-mono uppercase tracking-tighter opacity-70">Uplink Active</span>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.button>
                                ))}
                             </div>
                         </div>

                         {/* Thinking Config */}
                         {activeModel.supportsThinking && (
                             <div className={`mb-8 text-left`}>
                                 <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] mb-4 flex items-center gap-2 pr-2`}>
                                    <Zap size={12}/> 05. Latency / logic
                                    <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
                                 </div>
                                 <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className={`text-[10px] font-mono font-bold ${activeAesthetic.styles.subText}`}>Thinking Budget</div>
                                        <div className={`text-[10px] font-mono font-black ${activeAesthetic.styles.accent}`}>{thinkingBudget} FLOPs</div>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max={activeModel.maxThinkingBudget} 
                                        step="1024"
                                        value={thinkingBudget}
                                        onChange={(e) => setThinkingBudget(Number(e.target.value))}
                                        className="w-full h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-current"
                                    />
                                    <div className="flex justify-between mt-2">
                                        <span className={`text-[8px] font-mono ${activeAesthetic.styles.subText}`}>FAST (0)</span>
                                        <span className={`text-[8px] font-mono ${activeAesthetic.styles.subText}`}>DEEP ({activeModel.maxThinkingBudget})</span>
                                    </div>
                                 </div>
                             </div>
                         )}

                         {/* Advanced Toggles */}
                         <div className="grid grid-cols-3 gap-2 mt-6">
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSoundEnabled(!soundEnabled)} className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center gap-2 ${soundEnabled ? activeAesthetic.styles.text : activeAesthetic.styles.subText}`}>
                               {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                               <span className="text-[10px] font-mono uppercase tracking-widest leading-none text-center">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsApiKeyModalOpen(true)} className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center gap-2 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                               <Terminal size={16} />
                               <span className="text-[10px] font-mono uppercase tracking-widest leading-none text-center">Assistant Setup</span>
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsHelpModalOpen(true)} className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center gap-2 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                               <HelpCircle size={16} />
                               <span className="text-[10px] font-mono uppercase tracking-widest leading-none text-center">Shortcuts</span>
                            </motion.button>
                         </div>
                     </motion.div>
                 </>
             )}
             </AnimatePresence>

             <AnimatePresence>
             {isAdvancedSettingsOpen && (
                 <>
                     <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" 
                        onClick={() => setIsAdvancedSettingsOpen(false)}
                     ></motion.div>
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-[120%] right-0 w-[90vw] max-w-[420px] glass-panel rounded-2xl shadow-2xl z-50 p-6 overscroll-contain max-h-[80vh] overflow-y-auto custom-scrollbar border-white/20 backdrop-blur-3xl bg-black/80 origin-top-right text-left"
                     >
                         <div className="flex justify-between items-center mb-6 text-left">
                             <div className="flex flex-col">
                                <h3 className={`font-display font-medium text-xs tracking-widest uppercase ${activeAesthetic.styles.subText}`}>Deep Utilities</h3>
                                <h2 className={`text-xl font-bold font-display ${activeAesthetic.styles.text}`}>Advanced Systems</h2>
                             </div>
                             <button onClick={() => setIsAdvancedSettingsOpen(false)} className={`${activeAesthetic.styles.subText} hover:text-white p-2`}><X size={20}/></button>
                         </div>

                         <div className="space-y-6">
                            {/* Feature Toggles */}
                            <div>
                                <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] mb-3 flex items-center gap-2 pr-2`}>
                                    <Settings2 size={12}/> Global Toggles
                                    <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
                                </div>
                                <div className="space-y-2">
                                    <label className={`flex items-center justify-between p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 cursor-pointer hover:bg-white/10 transition-colors`}>
                                        <div className="flex items-center gap-3">
                                            <ShieldAlert size={16} className={safeSearch ? "text-emerald-400" : "text-red-400"} />
                                            <div>
                                                <div className={`text-sm font-bold ${activeAesthetic.styles.text}`}>Safe Search Mode</div>
                                                <div className={`text-[9px] font-mono opacity-70 ${activeAesthetic.styles.subText}`}>Filter out unsafe anomalies (highly recommended)</div>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={safeSearch} onChange={(e) => setSafeSearch(e.target.checked)} className="accent-current bg-transparent w-4 h-4 cursor-pointer" />
                                    </label>
                                    <label className={`flex items-center justify-between p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 cursor-pointer hover:bg-white/10 transition-colors`}>
                                        <div className="flex items-center gap-3">
                                            <Minimize2 size={16} className={compactMode ? activeAesthetic.styles.accent : activeAesthetic.styles.subText} />
                                            <div>
                                                <div className={`text-sm font-bold ${activeAesthetic.styles.text}`}>Compact UI View</div>
                                                <div className={`text-[9px] font-mono opacity-70 ${activeAesthetic.styles.subText}`}>Reduce padding & condense spatial data</div>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} className="accent-current bg-transparent w-4 h-4 cursor-pointer" />
                                    </label>
                                    <label className={`flex items-center justify-between p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 cursor-pointer hover:bg-white/10 transition-colors`}>
                                        <div className="flex items-center gap-3">
                                            <Ghost size={16} className={reducedMotion ? activeAesthetic.styles.accent : activeAesthetic.styles.subText} />
                                            <div>
                                                <div className={`text-sm font-bold ${activeAesthetic.styles.text}`}>Reduced Motion</div>
                                                <div className={`text-[9px] font-mono opacity-70 ${activeAesthetic.styles.subText}`}>Disable intense animations & parallax</div>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={reducedMotion} onChange={(e) => setReducedMotion(e.target.checked)} className="accent-current bg-transparent w-4 h-4 cursor-pointer" />
                                    </label>
                                    <label className={`flex items-center justify-between p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 cursor-pointer hover:bg-white/10 transition-colors`}>
                                        <div className="flex items-center gap-3">
                                            <Bug size={16} className={showDebugStats ? activeAesthetic.styles.accent : activeAesthetic.styles.subText} />
                                            <div>
                                                <div className={`text-sm font-bold ${activeAesthetic.styles.text}`}>Debug Data Overlay</div>
                                                <div className={`text-[9px] font-mono opacity-70 ${activeAesthetic.styles.subText}`}>Show backend metrics and LLM traces</div>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={showDebugStats} onChange={(e) => setShowDebugStats(e.target.checked)} className="accent-current bg-transparent w-4 h-4 cursor-pointer" />
                                    </label>
                                    <label className={`flex items-center justify-between p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 cursor-pointer hover:bg-white/10 transition-colors`}>
                                        <div className="flex items-center gap-3">
                                            <Volume1 size={16} className={autoSpeak ? activeAesthetic.styles.accent : activeAesthetic.styles.subText} />
                                            <div>
                                                <div className={`text-sm font-bold ${activeAesthetic.styles.text}`}>Auto-Speak Notes</div>
                                                <div className={`text-[9px] font-mono opacity-70 ${activeAesthetic.styles.subText}`}>Synthesize assistant notes via TTS on arrival</div>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} className="accent-current bg-transparent w-4 h-4 cursor-pointer" />
                                    </label>
                                    <label className={`flex items-center justify-between p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 cursor-pointer hover:bg-white/10 transition-colors`}>
                                        <div className="flex items-center gap-3">
                                            <Search size={16} className={searchEngineMode ? activeAesthetic.styles.accent : activeAesthetic.styles.subText} />
                                            <div>
                                                <div className={`text-sm font-bold ${activeAesthetic.styles.text}`}>Search Engine Mode</div>
                                                <div className={`text-[9px] font-mono opacity-70 ${activeAesthetic.styles.subText}`}>Make UI behave like a search engine completely</div>
                                            </div>
                                        </div>
                                        <input type="checkbox" checked={searchEngineMode} onChange={(e) => setSearchEngineMode(e.target.checked)} className="accent-current bg-transparent w-4 h-4 cursor-pointer" />
                                    </label>
                                </div>
                            </div>

                            {/* Data Source Settings */}
                            <div>
                                <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] mb-3 flex items-center gap-2 pr-2 mt-4`}>
                                    <Database size={12}/> Data Source
                                    <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
                                </div>
                                <div className="space-y-2">
                                     <select
                                        value={dataSource}
                                        onChange={(e) => setDataSource(e.target.value as 'gemini' | 'wikipedia' | 'miraheze')}
                                        className={`w-full p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 hover:bg-white/10 transition-colors text-sm font-bold ${activeAesthetic.styles.text} focus:outline-none focus:ring-1 focus:ring-amber-500`}
                                     >
                                        <option value="gemini" className="bg-zinc-900">Gemini AI (Creative Recommendations)</option>
                                        <option value="wikipedia" className="bg-zinc-900">Wikipedia (Encyclopedic Data)</option>
                                        <option value="miraheze" className="bg-zinc-900">Miraheze (Community Wikis)</option>
                                     </select>
                                     <p className={`mt-2 text-[9px] font-mono opacity-70 ${activeAesthetic.styles.subText}`}>Choose where the recommendations come from.</p>
                                </div>
                            </div>

                            {/* Queue Settings */}
                            <div>
                                <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] mb-3 flex items-center gap-2 pr-2`}>
                                    <ListOrdered size={12}/> Suggestion Queue
                                    <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
                                </div>
                                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className={`text-[10px] font-mono font-bold ${activeAesthetic.styles.subText}`}>Max Queue Length</div>
                                        <div className={`text-[10px] font-mono font-black ${activeAesthetic.styles.accent}`}>{maxQueueDepth} Sites</div>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="2" 
                                        max="50" 
                                        step="1"
                                        value={maxQueueDepth}
                                        onChange={(e) => setMaxQueueDepth(Number(e.target.value))}
                                        className="w-full h-1 bg-gray-700/50 rounded-lg appearance-none cursor-pointer accent-current"
                                    />
                                    <p className={`mt-3 text-[9px] ${activeAesthetic.styles.subText} italic opacity-60 font-mono text-center leading-relaxed`}>
                                        Larger queues use more system memory and bandwidth to fetch suggestions in the background.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Danger Zone */}
                            <div>
                                <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] mb-3 flex items-center gap-2 pr-2 mt-4`}>
                                    <AlertCircle size={12} className="text-red-500" /> Data Management
                                    <div className="h-[1px] flex-1 bg-white/10 ml-2"></div>
                                </div>
                                <div className="space-y-2">
                                     <motion.button 
                                        whileHover={{ scale: 1.02 }} 
                                        whileTap={{ scale: 0.98 }} 
                                        onClick={() => {
                                            if(window.confirm('Wipe all data? This will clear history, bookmarks, and settings. Irreversible.')) {
                                                localStorage.clear();
                                                window.location.reload();
                                            }
                                        }} 
                                        className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-500 text-[10px] font-mono uppercase tracking-widest font-bold`}
                                     >
                                        <Trash2 size={14} /> Reset All Data
                                     </motion.button>
                                </div>
                            </div>
                         </div>
                     </motion.div>
                 </>
             )}
             </AnimatePresence>

            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsApiKeyModalOpen(true)} className={`p-2 rounded-full transition-colors glass-panel hover:bg-white/10 hidden sm:block ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`} title="Assistant Setup">
               <BrainCircuit size={18} />
            </motion.button>

            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-full transition-colors glass-panel hover:bg-white/10 hidden sm:block ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text} relative`} title="Bookmarks & Collections">
              <Rabbit size={18} />
              {favorites.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>}
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleStumble} disabled={status === 'loading'} className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2 rounded-full font-bold transition-all transform shadow-lg ${activeAesthetic.id === 'solar' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : activeAesthetic.id === 'vapor' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white' : activeAesthetic.id === 'brutal' ? 'bg-lime-500 hover:bg-lime-400 text-black' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
              {status === 'loading' ? <RefreshCw size={16} className="animate-spin" /> : <Rabbit size={16} />}
              <span className="hidden sm:inline text-sm">Fall Down</span>
            </motion.button>
         </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden">
        
        {/* Decorative Blobs - Colored based on aesthetic */}
        <div className={`absolute top-0 right-[10%] w-[40rem] h-[40rem] rounded-full mix-blend-screen filter blur-[100px] opacity-20 ${!reducedMotion ? 'animate-blob' : ''} ${activeAesthetic.id === 'solar' ? 'bg-yellow-500' : activeAesthetic.id === 'vapor' ? 'bg-cyan-500' : activeAesthetic.id === 'brutal' ? 'bg-gray-400' : 'bg-purple-600'}`}></div>
        <div className={`absolute -bottom-[20%] left-[-10%] w-[50rem] h-[50rem] rounded-full mix-blend-screen filter blur-[120px] opacity-10 ${!reducedMotion ? 'animate-blob animation-delay-4000' : ''} ${activeAesthetic.id === 'solar' ? 'bg-emerald-500' : activeAesthetic.id === 'vapor' ? 'bg-pink-500' : activeAesthetic.id === 'brutal' ? 'bg-gray-600' : 'bg-indigo-600'}`}></div>

        {showWelcome ? (
          <AnimatePresence mode="wait">
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className={`flex flex-col items-center justify-center w-full max-w-7xl px-4 pt-16 z-10 ${searchEngineMode ? 'min-h-[60vh]' : 'min-h-[85vh]'}`}
          >
             {/* Huge Cinematic Hero */}
             <motion.h1 
                className={`text-[12vw] sm:text-[10vw] md:text-9xl font-black font-display text-center leading-[0.8] tracking-tighter ${activeAesthetic.styles.text} text-glow uppercase`}
             >
                Rabbit<span className={activeAesthetic.styles.accent}>Hole</span>.
             </motion.h1>

             {!searchEngineMode && (
                 <motion.p className={`mt-8 text-xl md:text-2xl font-light ${activeAesthetic.styles.subText} text-center max-w-2xl mix-blend-screen`}>
                     Descend into the obscure. An AI-curated index of the internet’s finest buried anomalies from {activeEra.name}.
                 </motion.p>
             )}
             
             {/* Giant Search Command */}
             <motion.div className="w-full max-w-3xl mt-12 relative z-20">
                <form onSubmit={(e) => handleSearch(e)} className="relative group">
                    <div className={`absolute -inset-1 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${activeAesthetic.styles.highlight.replace('text-', 'bg-')}`}></div>
                    <div className="relative glass-pill flex items-center p-3 pl-6">
                        <Search size={24} className={`${activeAesthetic.styles.accent} mr-4 animate-pulse`} />
                        <input 
                            ref={searchInputRef}
                            type="text"
                            placeholder={searchEngineMode ? 'Search the web...' : `Ask ${activePersona.name} to find...`}
                            className={`flex-1 bg-transparent border-none text-xl md:text-2xl ${activeAesthetic.styles.text} outline-none placeholder-white/30`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className={`hidden md:block py-3 px-8 rounded-full font-bold ml-4 transition-transform text-white ${activeAesthetic.id === 'solar' ? 'bg-emerald-600' : activeAesthetic.id === 'brutal' ? 'bg-lime-500 text-black' : 'bg-indigo-600'}`}>
                           {searchEngineMode ? 'Search' : 'Initiate'}
                        </motion.button>
                    </div>
                </form>
             </motion.div>

             {/* Quick Filters Grid (Replaces old clunky buttons) */}
             {!searchEngineMode && (
                 <motion.div className="mt-16 w-full max-w-5xl">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className={`font-mono text-xs tracking-[0.3em] uppercase ${activeAesthetic.styles.subText}`}>Categories</h3>
                       <button onClick={handleStumble} className={`flex items-center gap-2 text-xs font-mono font-bold tracking-widest ${activeAesthetic.styles.accent} hover:text-white transition-colors`}>
                          <Sparkles size={14}/> I'm Feeling Lucky
                       </button>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                       <AnimatePresence>
                       {COLLECTIONS.map((cat, i) => (
                          <motion.button 
                             layout="position"
                             key={cat.id}
                             onClick={() => handleSearch(undefined, cat.query)}
                             initial={{ opacity: 0, scale: 0.8, y: 30 }}
                             animate={{ opacity: 1, scale: 1, y: 0 }}
                             exit={{ opacity: 0, scale: 0.8, y: -30 }}
                             transition={{ delay: i * 0.05, type: 'spring', bounce: 0.4 }}
                             whileHover={{ scale: 1.05, y: -5 }}
                             whileTap={{ scale: 0.95 }}
                             className="glass-panel rounded-3xl p-6 flex flex-col items-start gap-4 hover:bg-white/10 transition-all group overflow-hidden relative"
                          >
                             <div className={`absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/20 transition-all ${activeAesthetic.styles.text}`}></div>
                             <div className={`p-4 rounded-xl glass-panel ${activeAesthetic.styles.text} group-hover:scale-110 transition-transform shadow-2xl`}>
                                <cat.icon size={28} />
                             </div>
                             <div>
                                <span className={`block font-bold text-lg ${activeAesthetic.styles.text} tracking-tight`}>{cat.label}</span>
                                <span className={`block text-[10px] font-mono mt-1 ${activeAesthetic.styles.subText} uppercase line-clamp-1`}>{cat.query}</span>
                             </div>
                          </motion.button>
                       ))}
                       </AnimatePresence>
                    </div>
                 </motion.div>
             )}
          </motion.div>
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="wait">
          <motion.div 
             key="main-content"
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: 30 }}
             className="w-full max-w-7xl z-10 min-h-[500px] flex items-center justify-center pt-24"
          >
            <AnimatePresence mode="wait">
            {status === 'loading' ? (
              <motion.div key="loading" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full">
                <WebLoading />
              </motion.div>
            ) : searchResults ? (
               <motion.div key="search-results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full mx-auto px-4 relative z-10 max-w-7xl">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className={`text-4xl font-display font-black tracking-tight ${activeAesthetic.styles.text} mb-2`}>Search Results</h2>
                        <p className={`text-sm ${activeAesthetic.styles.subText} font-mono uppercase tracking-widest`}>
                            Query: <span className="text-white">"{searchQuery}"</span>
                        </p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setIsSearchActive(false); setSearchQuery(''); setSearchResults(null); handleStumble(); }} 
                        className={`px-4 py-2 rounded-lg border ${activeAesthetic.styles.border} hover:bg-white/5 ${activeAesthetic.styles.text} font-bold text-sm flex items-center gap-2 transition-colors`}
                    >
                        <X size={16}/> Clear Results
                    </motion.button>
                 </div>

                 {/* Deep Research Synthesis */}
                 <AnimatePresence>
                     {aiSummary && (
                         <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                             className={`mb-8 p-6 rounded-2xl border ${activeAesthetic.styles.border} glass-panel relative overflow-hidden`}
                         >
                             <div className={`absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none`}></div>
                             <div className="flex items-center gap-3 mb-4">
                                 <Sparkles size={20} className={activeAesthetic.styles.accent} />
                                 <h3 className={`font-bold font-display text-lg ${activeAesthetic.styles.text}`}>Deep Research Synthesis</h3>
                             </div>
                             <div className={`text-sm md:text-base leading-relaxed ${activeAesthetic.styles.subText} markdown-body ai-summary max-h-96 overflow-y-auto custom-scrollbar pr-4`}>
                                 <Markdown>{aiSummary}</Markdown>
                             </div>
                         </motion.div>
                     )}
                 </AnimatePresence>
                 
                 <motion.div 
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                 >
                    <AnimatePresence>
                    {searchResults.map((site, idx) => (
                        <motion.div 
                          layout
                          key={site.id} 
                          variants={{
                              hidden: { opacity: 0, y: 30, scale: 0.9 },
                              visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4 } }
                          }}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, scale: 0.9, y: 20 }}
                          onClick={() => selectSearchResult(site)}
                          className={`p-6 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.02] border ${activeAesthetic.styles.border} ${activeAesthetic.styles.cardBg} hover:border-current hover:bg-black/30 group relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-lg hover:shadow-2xl`}
                        >
                           <div className={`absolute -inset-1 opacity-0 group-hover:opacity-10 blur-2xl transition-all duration-500 ${
                             activeAesthetic.id === 'cyber' ? 'bg-pink-500' : 'bg-current'
                           }`}></div>
                           
                           <div>
                               <div className="flex justify-between items-start mb-4">
                                   <div className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-sm ${CATEGORY_COLORS[site.category] || 'bg-slate-600'} text-white tracking-widest`}>
                                       {site.category}
                                   </div>
                                   {site.vibeScore && (
                                       <div className={`text-[10px] font-mono tracking-widest font-bold ${activeAesthetic.styles.highlight}`}>
                                           {site.vibeScore}% VIBE
                                       </div>
                                   )}
                               </div>
                               <h3 className={`text-2xl font-display font-bold ${activeAesthetic.styles.text} mb-3 leading-tight line-clamp-2`}>{site.title}</h3>
                               <p className={`text-sm ${activeAesthetic.styles.subText} line-clamp-3 leading-relaxed`}>{site.description}</p>
                           </div>
                           
                           <div className={`pt-4 mt-4 border-t ${activeAesthetic.styles.border} w-full flex items-center justify-between`}>
                               <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase flex items-center gap-1`}>
                                   <ExternalLink size={12} /> {new URL(site.url).hostname}
                               </div>
                               <div className={`opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase font-bold tracking-widest ${activeAesthetic.styles.accent}`}>
                                   View Site &rarr;
                               </div>
                           </div>
                        </motion.div>
                    ))}
                    </AnimatePresence>
                 </motion.div>
              </motion.div>
            ) : currentSite ? (
               <motion.div key="site-renderer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="w-full">
                  <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 px-4 w-full max-w-4xl mx-auto z-50">
                      {isSearchActive ? (
                         <span className={`${activeAesthetic.styles.cardBg} ${activeAesthetic.styles.text} border ${activeAesthetic.styles.border} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 relative`}>
                             <Search size={12} /> Results for: "{searchQuery}"
                             <button onClick={() => { setIsSearchActive(false); setSearchQuery(''); handleStumble(); }} className="hover:opacity-50"><X size={12}/></button>
                         </span>
                      ) : (
                         <div />
                      )}

                      {/* View Mode Toggle */}
                      <div className={`flex items-center gap-1 ${activeAesthetic.styles.cardBg} border ${activeAesthetic.styles.border} p-1 rounded-full relative z-50`}>
                          <button 
                             onClick={() => setViewMode('classic')}
                             className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'classic' ? `${activeAesthetic.styles.accent} bg-white/10` : activeAesthetic.styles.subText}`}
                          >
                             <Eye size={12} /> Focus
                          </button>
                          <button 
                             onClick={() => {
                                 setViewMode('graph');
                                 playSound('blip');
                             }}
                             className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'graph' ? `${activeAesthetic.styles.accent} bg-white/10` : activeAesthetic.styles.subText}`}
                          >
                             <Map size={12} /> Topology
                          </button>
                      </div>
                  </div>
                 <AnimatePresence mode="wait">
                    {viewMode === 'graph' ? (
                       <motion.div
                         key="graph-view"
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 1.05 }}
                         transition={{ duration: 0.4 }}
                         className="w-full max-w-6xl mx-auto px-4 z-10 relative"
                       >
                         <GraphView 
                            history={history} 
                            aesthetic={activeAesthetic} 
                            onNodeClick={(s) => {
                                setCurrentSite(s);
                                setViewMode('classic');
                                playSound('blip');
                            }} 
                         />
                       </motion.div>
                    ) : (
                       <motion.div
                         key={currentSite.id}
                         initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                         animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                         exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                         transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                       >
                         <SiteCard 
                            site={currentSite} 
                            aesthetic={activeAesthetic}
                            persona={activePersona}
                            era={activeEra}
                            isFavorite={favorites.some(f => f.id === currentSite.id)}
                            onToggleFavorite={(s) => { playSound('blip'); toggleFavorite(s); }}
                            onUpdateSite={handleUpdateSite}
                            onVisit={() => window.open(currentSite.url, '_blank')}
                            onTagClick={handleTagClick}
                            onFindSimilar={handleFindSimilar}
                            onAnalyze={handleAnalyzeSite}
                            selectedTag={selectedTag}
                            analysisText={currentAnalysis}
                            isAnalyzing={isAnalyzing}
                            compactMode={compactMode}
                            autoSpeak={autoSpeak}
                         />
                       </motion.div>
                    )}
                 </AnimatePresence>
              </motion.div>
            ) : (
               <motion.div key="error-lost" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`text-center ${activeAesthetic.styles.subText}`}>
                 <AlertCircle size={48} className="mx-auto mb-2 opacity-50" />
                 <p className="mb-4">Signal lost. The weird web is vast, but sometimes empty.</p>
                 <div className="flex gap-4 justify-center">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setSelectedTag(null); setSelectedCategory(Category.ALL); setIsSearchActive(false); setSearchQuery(''); playSound('blip'); }} className="hover:text-white underline">Clear All Filters</motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleStumble} className={`${activeAesthetic.styles.accent} hover:underline`}>Retry</motion.button>
                 </div>
               </motion.div>
            )}
            </AnimatePresence>
          </motion.div>
          </AnimatePresence>
        )}

        {/* Mobile Stumble FAB */}
        {!showWelcome && (
          <motion.button 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStumble}
            className={`sm:hidden fixed bottom-6 right-6 z-50 ${activeAesthetic.id === 'solar' ? 'bg-emerald-600' : activeAesthetic.id === 'vapor' ? 'bg-fuchsia-600' : activeAesthetic.id === 'brutal' ? 'bg-lime-600 text-black' : 'bg-indigo-600'} text-white p-4 rounded-full shadow-2xl transition-transform`}
          >
            {status === 'loading' ? <RefreshCw className="animate-spin" /> : <Sparkles />}
          </motion.button>
        )}
      </main>

      {/* Sidebar Drawer */}
      <AnimatePresence>
      {isSidebarOpen && (
          <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className={`fixed inset-y-0 right-0 z-50 w-80 glass-panel border-l ${activeAesthetic.styles.border} shadow-2xl flex flex-col backdrop-blur-3xl bg-black/80`}
          >
            <div className={`p-6 border-b ${activeAesthetic.styles.border} flex justify-between items-center`}>
              <h2 className={`font-display font-bold text-xl uppercase tracking-widest ${activeAesthetic.styles.text}`}>Terminal Log</h2>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setIsSidebarOpen(false)} className={`p-2 rounded-full glass-panel hover:bg-white/10 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                <X size={18} />
              </motion.button>
            </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="md:hidden flex flex-col gap-3 mb-8">
               <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                     setIsSidebarOpen(false);
                     setIsSubmitModalOpen(true);
                  }}
                  className={`flex flex-col gap-1 p-4 rounded-xl border ${activeAesthetic.styles.border} bg-white/5 hover:bg-white/10 transition-colors w-full`}
               >
                  <span className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest ${activeAesthetic.styles.text}`}>
                     <Plus size={14} className={activeAesthetic.styles.highlight} /> Submit Node
                  </span>
                  <span className={`text-[10px] ${activeAesthetic.styles.subText} text-left`}>Archive a weird site.</span>
               </motion.button>
               
               <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                     setIsSidebarOpen(false);
                     setSelectedTag(null);
                     setSelectedCategory(Category.ALL);
                     setSearchQuery('');
                     setIsSearchActive(false);
                     handleStumble();
                  }}
                  className={`flex flex-col gap-1 p-4 rounded-xl border ${activeAesthetic.styles.border} bg-white/5 hover:bg-white/10 transition-colors w-full mt-2`}
               >
                  <span className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest ${activeAesthetic.styles.text}`}>
                     <Dices size={14} className={activeAesthetic.styles.highlight} /> Feeling Lucky
                  </span>
                  <span className={`text-[10px] ${activeAesthetic.styles.subText} text-left`}>Stumble into the void.</span>
               </motion.button>
               <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                     setIsSidebarOpen(false);
                     setIsHelpModalOpen(true);
                  }}
                  className={`xl:hidden flex flex-col gap-1 p-4 rounded-xl border ${activeAesthetic.styles.border} bg-white/5 hover:bg-white/10 transition-colors w-full mt-2`}
               >
                  <span className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest ${activeAesthetic.styles.text}`}>
                     <HelpCircle size={14} className={activeAesthetic.styles.highlight} /> Sys Help
                  </span>
                  <span className={`text-[10px] ${activeAesthetic.styles.subText} text-left`}>Terminal manual & controls.</span>
               </motion.button>
          </div>

          {/* Research Archive */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-[10px] font-mono font-bold ${activeAesthetic.styles.subText} uppercase tracking-[0.2em] flex items-center gap-2`}>
                <NotebookPen size={12} className={activeAesthetic.styles.accent} /> Research Archive
              </h3>
              <div className="flex gap-2">
                {favorites.length > 0 && (
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => exportExpeditionMarkdown('all')} 
                    className={`p-1.5 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}
                    title="Export All to Markdown"
                  >
                    <Download size={14} />
                  </motion.button>
                )}
                <motion.button 
                   whileHover={{ scale: 1.1 }} 
                   whileTap={{ scale: 0.9 }} 
                   onClick={() => {
                      const name = prompt("Expedition Name:");
                      if (name) {
                          const newEx: Expedition = {
                              id: Math.random().toString(36).substr(2, 9),
                              name,
                              description: "",
                              createdAt: new Date().toISOString(),
                              tags: []
                          };
                          setExpeditions(prev => [newEx, ...prev]);
                          playSound('success');
                      }
                   }} 
                   className={`p-1.5 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}
                   title="New Expedition"
                >
                  <FolderPlus size={14} />
                </motion.button>
              </div>
            </div>

            {/* Expeditions List */}
            {expeditions.length > 0 && (
               <div className="space-y-4 mb-8">
                  {expeditions.map(ex => {
                      const count = favorites.filter(f => f.expeditionId === ex.id).length;
                      return (
                        <div key={ex.id} className={`p-4 rounded-xl border ${activeAesthetic.styles.border} bg-white/5`}>
                           <div className="flex justify-between items-center mb-2">
                              <h4 className={`text-xs font-bold ${activeAesthetic.styles.text}`}>{ex.name}</h4>
                              <div className="flex gap-2">
                                <button onClick={() => exportExpeditionMarkdown(ex.id)} className={`${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`} title="Export Expedition"><Download size={12}/></button>
                                <button onClick={() => setExpeditions(prev => prev.filter(e => e.id !== ex.id))} className="text-red-500/50 hover:text-red-500"><Trash2 size={12}/></button>
                              </div>
                           </div>
                           <div className={`text-[10px] ${activeAesthetic.styles.subText} mb-2`}>{count} nodes collected</div>
                           <div className="flex flex-col gap-1">
                              {favorites.filter(f => f.expeditionId === ex.id).slice(0, 3).map(f => (
                                 <button key={f.id} onClick={() => { setCurrentSite(f); setIsSidebarOpen(false); setShowWelcome(false); }} className={`text-[9px] ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text} text-left truncate`}>
                                    &bull; {f.title}
                                 </button>
                              ))}
                           </div>
                        </div>
                      );
                  })}
               </div>
            )}

            {/* Ungrouped/All Favorites */}
            <div className="space-y-3">
              <div className={`text-[9px] font-mono font-bold ${activeAesthetic.styles.subText} uppercase mb-2`}>
                 {expeditions.length > 0 ? "Ungrouped Nodes" : "All Discoveries"}
              </div>
              <AnimatePresence>
              {favorites.filter(f => !f.expeditionId || expeditions.length === 0).map((site, i) => (
                <motion.div 
                   layout
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   transition={{ delay: i * 0.05 }}
                   key={site.id} 
                   className={`bg-white/5 rounded-xl p-4 border border-white/5 hover:${activeAesthetic.styles.border} transition-colors group cursor-pointer`} 
                   onClick={() => { setCurrentSite(site); setIsSidebarOpen(false); setShowWelcome(false); }}
                >
                   <div className="flex justify-between items-start">
                     <h4 className={`font-bold ${activeAesthetic.styles.text} text-sm line-clamp-1`}>{site.title}</h4>
                     <div className="flex gap-2 items-center">
                        {expeditions.length > 0 && (
                            <select 
                               onClick={e => e.stopPropagation()}
                               onChange={e => {
                                   handleUpdateSite({ ...site, expeditionId: e.target.value });
                               }}
                               value={site.expeditionId || ""}
                               className={`bg-black/50 border-none text-[8px] rounded px-1 text-white opacity-0 group-hover:opacity-100 transition-opacity`}
                            >
                               <option value="">Move to...</option>
                               {expeditions.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
                            </select>
                        )}
                        <motion.button whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); toggleFavorite(site); }} className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={14} />
                        </motion.button>
                     </div>
                   </div>
                   <p className={`text-[10px] ${activeAesthetic.styles.subText} mt-1 line-clamp-1 leading-relaxed italic`}>{site.description}</p>
                   {site.fieldNote && (
                      <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2">
                        <NotebookPen size={10} className={activeAesthetic.styles.accent} />
                        <span className={`text-[9px] ${activeAesthetic.styles.subText} truncate`}>{site.fieldNote}</span>
                      </div>
                   )}
                </motion.div>
              ))}
              </AnimatePresence>
              {favorites.length === 0 && (
                 <p className={`text-[10px] ${activeAesthetic.styles.subText} italic text-center py-4`}>No nodes archived yet.</p>
              )}
            </div>
          </div>

          <div>
             <div className="flex justify-between items-center mb-4">
               <h3 className={`text-[10px] font-mono font-bold ${activeAesthetic.styles.subText} uppercase tracking-widest flex items-center gap-2`}>
                 <History size={10} /> Session Log
               </h3>
               {history.length > 0 && (
                 <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { if(confirm('Erase entire session log?')) setHistory([]) }} className={`text-[10px] uppercase font-mono ${activeAesthetic.styles.subText} hover:text-red-400 transition-colors flex items-center gap-1`} title="Clear History">
                    <Trash2 size={10} /> Clear
                 </motion.button>
               )}
             </div>
             <div className="space-y-3">
               <AnimatePresence>
               {history.map((site, idx) => (
                 <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: idx * 0.05 }}
                    key={`${site.id}-${idx}`} 
                    className={`group bg-white/5 rounded-xl p-4 border border-transparent hover:${activeAesthetic.styles.border} transition-colors cursor-pointer`} 
                    onClick={() => { setCurrentSite(site); setIsSidebarOpen(false); setShowWelcome(false); }}
                 >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className={`font-bold ${activeAesthetic.styles.text} text-sm line-clamp-1 group-hover:${activeAesthetic.styles.accent} transition-colors`}>{site.title}</h4>
                      <span className={`text-[9px] uppercase tracking-widest font-mono px-2 py-1 rounded bg-black/50 ${CATEGORY_COLORS[site.category]} text-white`}>
                        {site.category.split(' ')[0]}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${activeAesthetic.styles.subText}`}>
                      <ExternalLink size={10} />
                      <span className="truncate">{new URL(site.url).hostname}</span>
                    </div>
                 </motion.div>
               ))}
               </AnimatePresence>
               <AnimatePresence>
               {history.length === 0 && (
                 <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`text-sm ${activeAesthetic.styles.subText} italic text-center py-4`}>No stumbles yet.</motion.p>
               )}
               </AnimatePresence>
             </div>
           </div>

           {/* Terminal Operations / Data Management */}
           <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
               <h3 className={`text-[10px] font-mono font-bold ${activeAesthetic.styles.subText} uppercase tracking-widest flex items-center gap-2`}>
                 <Database size={10} /> Data Management
               </h3>
             </div>
             <div className="flex flex-col gap-2">
                <button 
                  onClick={exportAllData} 
                  className={`flex flex-1 items-center gap-2 p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-mono uppercase tracking-widest ${activeAesthetic.styles.text}`}
                >
                   <Download size={14} className={activeAesthetic.styles.accent} />
                   Backup Data
                </button>
                <div className="relative">
                    <input 
                      type="file" 
                      accept=".json" 
                      onChange={importAllData}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button 
                      className={`w-full flex items-center gap-2 p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-mono uppercase tracking-widest ${activeAesthetic.styles.text}`}
                    >
                       <Upload size={14} className={activeAesthetic.styles.accent} />
                       Restore Backup
                    </button>
                </div>
                <button 
                  onClick={() => {
                      bulkEnqueueUrls();
                      setIsSidebarOpen(false);
                      setShowWelcome(false);
                  }} 
                  className={`flex items-center gap-2 p-3 rounded-lg border ${activeAesthetic.styles.border} bg-white/5 hover:bg-white/10 transition-colors text-[10px] font-mono uppercase tracking-widest ${activeAesthetic.styles.text}`}
                >
                   <Globe size={14} className={activeAesthetic.styles.accent} />
                   Bulk Enqueue URLs
                </button>
             </div>
           </div>
        </div>
      </motion.div>
      )}
      </AnimatePresence>

      {/* Overlay for Sidebar */}
      <AnimatePresence>
      {isSidebarOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)}></motion.div>
      )}
      </AnimatePresence>

      {/* Submit Modal */}
      <AnimatePresence>
      {isSubmitModalOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
           <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`w-full max-w-md ${activeAesthetic.styles.cardBg} border ${activeAesthetic.styles.border} rounded-xl p-6 shadow-2xl relative`}
           >
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setIsSubmitModalOpen(false)} className={`absolute top-4 right-4 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                 <X size={20} />
              </motion.button>
              <h2 className={`text-2xl font-bold font-display ${activeAesthetic.styles.text} mb-2`}>Submit a Node</h2>
              <p className={`text-sm ${activeAesthetic.styles.subText} mb-6`}>Help expand the weird web. Your submission will be stored locally.</p>
              <form onSubmit={(e) => {
                 e.preventDefault();
                 const formData = new FormData(e.currentTarget);
                 const newSite = {
                    id: Math.random().toString(36).substr(2, 9),
                    title: formData.get('title') as string,
                    url: formData.get('url') as string,
                    description: formData.get('description') as string,
                    category: formData.get('category') as Category,
                    tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean),
                    submittedAt: new Date().toISOString()
                 };
                 setSubmittedSites(prev => [newSite, ...prev]);
                 setIsSubmitModalOpen(false);
                 playSound('success');
              }} className="space-y-4">
                 
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${activeAesthetic.styles.subText} mb-1`}>Title</label>
                    <input name="title" required className={`w-full bg-black/30 border ${activeAesthetic.styles.border} rounded p-2 text-sm ${activeAesthetic.styles.text}`} placeholder="Site Title" />
                 </motion.div>
                 
                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${activeAesthetic.styles.subText} mb-1`}>URL</label>
                    <input name="url" type="url" required className={`w-full bg-black/30 border ${activeAesthetic.styles.border} rounded p-2 text-sm ${activeAesthetic.styles.text}`} placeholder="https://..." />
                 </motion.div>

                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${activeAesthetic.styles.subText} mb-1`}>Description</label>
                    <textarea name="description" required rows={3} className={`w-full bg-black/30 border ${activeAesthetic.styles.border} rounded p-2 text-sm ${activeAesthetic.styles.text}`} placeholder="What makes it weird?" />
                 </motion.div>

                 <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider ${activeAesthetic.styles.subText} mb-1`}>Category</label>
                        <select name="category" required className={`w-full bg-black/30 border ${activeAesthetic.styles.border} rounded p-2 text-sm ${activeAesthetic.styles.text}`}>
                            {Object.values(Category).filter(c => c !== Category.ALL).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={`block text-xs font-bold uppercase tracking-wider ${activeAesthetic.styles.subText} mb-1`}>Tags (comma-separated)</label>
                        <input name="tags" placeholder="weird, web1.0, art" className={`w-full bg-black/30 border ${activeAesthetic.styles.border} rounded p-2 text-sm ${activeAesthetic.styles.text}`} />
                    </div>
                 </motion.div>

                 <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full mt-4 ${activeAesthetic.styles.accent.replace('text-', 'bg-')} text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity`}>
                    Archive Site
                 </motion.button>
              </form>
              <AnimatePresence>
              {submittedSites.length > 0 && (
                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-8 pt-6 border-t border-white/10 overflow-hidden">
                    <h3 className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider mb-3`}>Your Submissions</h3>
                    <motion.div 
                       initial="hidden"
                       animate="visible"
                       variants={{
                          hidden: { opacity: 0 },
                          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                       }}
                       className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar"
                    >
                       <AnimatePresence>
                       {submittedSites.map(s => (
                          <motion.div 
                             variants={{
                                hidden: { opacity: 0, x: -10 },
                                visible: { opacity: 1, x: 0 }
                             }}
                             exit={{ opacity: 0, scale: 0.8 }}
                             key={s.id} 
                             className="text-xs flex justify-between items-center p-2 rounded bg-white/5"
                          >
                             <span className={`font-medium ${activeAesthetic.styles.text} truncate max-w-[200px]`}>{s.title}</span>
                             <span className={activeAesthetic.styles.subText}>{new Date(s.submittedAt).toLocaleDateString()}</span>
                          </motion.div>
                       ))}
                       </AnimatePresence>
                    </motion.div>
                 </motion.div>
              )}
              </AnimatePresence>
           </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
      {isApiKeyModalOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4" 
            onClick={() => setIsApiKeyModalOpen(false)}
        >
           <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`w-full max-w-md ${activeAesthetic.styles.cardBg} border-2 ${activeAesthetic.styles.border} rounded-2xl p-8 shadow-[0_0_50px_rgba(99,102,241,0.2)] relative`} 
              onClick={e => e.stopPropagation()}
           >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className={`p-4 rounded-full bg-black border-2 ${activeAesthetic.styles.border} shadow-lg shadow-indigo-500/20 animate-pulse`}>
                    <BrainCircuit size={32} className={activeAesthetic.id === 'solar' ? 'text-yellow-400' : 'text-indigo-400'} />
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setIsApiKeyModalOpen(false)} className={`absolute top-4 right-4 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                 <X size={20} />
              </motion.button>

              <h2 className={`text-2xl font-bold font-display ${activeAesthetic.styles.text} mt-4 mb-2 text-center`}>
                Assistant Configuration
              </h2>
              <p className={`text-xs ${activeAesthetic.styles.subText} text-center mb-6 leading-relaxed`}>
                Enter your Gemini API key below to enable personalized recommendations.
              </p>

              <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const key = formData.get('apiKey') as string;
                  window.localStorage.setItem('RABBIT_HOLE_API_KEY', key);
                  setIsApiKeyModalOpen(false);
                  playSound('success');
                  // Quick refresh of the app state might be needed or just let the next AI call use the new key
                  setGlobalError(null);
              }} className="space-y-6">
                 <div>
                    <label className={`block text-[10px] font-black uppercase tracking-[0.2em] ${activeAesthetic.styles.subText} mb-2`}>
                        Gemini API Key
                    </label>
                    <div className="relative">
                        <input 
                            name="apiKey" 
                            type="password"
                            defaultValue={window.localStorage.getItem('RABBIT_HOLE_API_KEY') || ""}
                            placeholder="Enter your API key..."
                            className={`w-full bg-black/40 border-2 ${activeAesthetic.styles.border} rounded-xl p-3 pr-10 text-sm ${activeAesthetic.styles.text} font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50">
                            <Zap size={16} className={activeAesthetic.styles.accent} />
                        </div>
                    </div>
                 </div>

                 <div className={`p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-start gap-3`}>
                    <AlertCircle size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                    <div className="text-[10px] leading-relaxed text-indigo-200/60 uppercase font-mono">
                        Note: For AI Studio integration, ensure your key is valid and has "Builder" permissions if applicable. No placeholders allowed.
                    </div>
                 </div>

                 <motion.button 
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 transition-all ${activeAesthetic.id === 'solar' ? 'bg-yellow-500 text-black' : 'bg-indigo-600 text-white'}`}
                 >
                    Save Configuration
                 </motion.button>

                 <div className="text-center pt-2">
                    <button 
                        type="button"
                        onClick={() => {
                            window.localStorage.removeItem('RABBIT_HOLE_API_KEY');
                            (document.querySelector('input[name="apiKey"]') as HTMLInputElement).value = "";
                            playSound('static');
                        }}
                        className={`text-[9px] uppercase tracking-widest font-bold ${activeAesthetic.styles.subText} hover:text-red-400 transition-colors`}
                    >
                        Reset to Environment Defaults
                    </button>
                 </div>
              </form>
           </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Help Modal */}
      <AnimatePresence>
      {isHelpModalOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
            onClick={() => setIsHelpModalOpen(false)}
        >
           <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={`w-full max-w-sm ${activeAesthetic.styles.cardBg} border ${activeAesthetic.styles.border} rounded-xl p-6 shadow-2xl relative`} 
              onClick={e => e.stopPropagation()}
           >
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setIsHelpModalOpen(false)} className={`absolute top-4 right-4 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                 <X size={20} />
              </motion.button>
              <h2 className={`text-2xl font-bold font-display ${activeAesthetic.styles.text} mb-4 flex items-center gap-2`}>
                <Ghost size={24} className={activeAesthetic.styles.accent} />
                Terminal Manual
              </h2>
              
              <motion.div 
                 initial="hidden"
                 animate="visible"
                 variants={{
                     hidden: { opacity: 0 },
                     visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
                 }}
                 className="space-y-4"
              >
                 <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Stumble Forward</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>Space</kbd>
                 </motion.div>
                 <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Stumble Forward</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>→</kbd>
                 </motion.div>
                 <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Go Back</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>←</kbd>
                 </motion.div>
                 <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Focus Search</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>/</kbd>
                 </motion.div>
                 <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Toggle Sound</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>M</kbd>
                 </motion.div>
                 <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Favorite Site</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>F</kbd>
                 </motion.div>
                 <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Clear Queue</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>Q</kbd>
                 </motion.div>
                 <motion.div variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }} className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Toggle Help Info</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>?</kbd>
                 </motion.div>
              </motion.div>
           </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {globalError && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.8 }} 
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
          >
              <div className="bg-black/90 text-white px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(255,0,0,0.3)] border border-red-500/50 flex flex-col gap-2 backdrop-blur-xl max-w-sm sm:max-w-md w-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                  <div className="flex items-center gap-3">
                      <Rabbit size={24} className="text-red-500 shrink-0" />
                      <div className="flex-1">
                        <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-red-400 mb-1">Hole Collapse Detected</h4>
                        <p className="text-sm font-mono leading-tight text-red-100">{globalError}</p>
                      </div>
                      <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setGlobalError(null)} className="p-1 hover:bg-white/10 rounded self-start">
                          <X size={16} />
                      </motion.button>
                  </div>
              </div>
          </motion.div>
      )}
      </AnimatePresence>

      {/* Debug Overlay */}
      <AnimatePresence>
          {showDebugStats && (
              <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="fixed bottom-20 left-4 z-50 glass-panel border-white/20 p-4 rounded-lg flex flex-col gap-2 min-w-[200px] pointer-events-none text-left backdrop-blur-md"
              >
                  <div className={`text-[9px] font-mono font-bold tracking-widest ${activeAesthetic.styles.accent} flex items-center gap-2 mb-2 uppercase`}>
                      <Bug size={10} /> Debug Data
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono gap-4">
                      <span className={activeAesthetic.styles.subText}>LATENCY</span>
                      <span className={activeAesthetic.styles.text}>{thinkingBudget > 0 ? '>2000MS' : 'NORMAL'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono gap-4">
                      <span className={activeAesthetic.styles.subText}>QUEUE DEPTH</span>
                      <span className={activeAesthetic.styles.text}>{siteQueue.length} / {maxQueueDepth}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono gap-4">
                      <span className={activeAesthetic.styles.subText}>MEMORY USAGE</span>
                      <span className={activeAesthetic.styles.text}>{((history.length + favorites.length) * 0.4).toFixed(1)}MB</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono gap-4">
                      <span className={activeAesthetic.styles.subText}>UI MODE</span>
                      <span className={activeAesthetic.styles.text}>{compactMode ? 'COMPACT' : 'FULL'}</span>
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono gap-4">
                      <span className={activeAesthetic.styles.subText}>SAFE SEARCH</span>
                      <span className={activeAesthetic.styles.text}>{safeSearch ? 'ON' : 'OFF'}</span>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      {/* System Status Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none flex flex-col sm:flex-row items-end sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
              <div className="glass-pill px-3 py-1.5 flex items-center gap-2 pointer-events-auto shadow-lg">
                  <div className={`w-1.5 h-1.5 rounded-full ${status === 'loading' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <span className={`text-[9px] font-mono font-black tracking-[0.2em] ${activeAesthetic.styles.text}`}>SYS: {status === 'loading' ? 'BUSY' : 'IDLE'}</span>
              </div>
              <div className="glass-pill px-3 py-1.5 flex items-center gap-2 pointer-events-auto shadow-lg hidden md:flex">
                  <Type size={10} className={activeAesthetic.styles.accent} />
                  <span className={`text-[9px] font-mono font-black tracking-[0.2em] ${activeAesthetic.styles.text}`}>{activeAesthetic.styles.font?.replace('font-', '').toUpperCase() || 'SANS'}</span>
              </div>
              <div className="glass-pill px-3 py-1.5 flex items-center gap-2 pointer-events-auto shadow-lg hidden md:flex">
                  <Archive size={10} className={activeAesthetic.styles.accent} />
                  <span className={`text-[9px] font-mono font-black tracking-[0.2em] ${activeAesthetic.styles.text}`}>{history.length} VISITED</span>
              </div>
          </div>

          <div className="flex items-center gap-2">
              <div className="glass-pill px-3 py-1.5 flex items-center gap-3 pointer-events-auto shadow-lg backdrop-blur-3xl">
                  <div className="flex items-center gap-1.5">
                      <Cpu size={10} className={activeAesthetic.styles.subText} />
                      <span className={`text-[9px] font-mono uppercase tracking-tighter ${activeAesthetic.styles.text} truncate max-w-[80px]`}>{activeModel.name}</span>
                  </div>
                  <div className="h-3 w-[1px] bg-white/10"></div>
                  <div className="flex items-center gap-1.5">
                      <User size={10} className={activeAesthetic.styles.subText} />
                      <span className={`text-[9px] font-mono uppercase tracking-tighter ${activeAesthetic.styles.text}`}>{activePersona.name.split(' ')[0]}</span>
                  </div>
              </div>
          </div>
      </footer>

    </div>
  );
};

export default App;