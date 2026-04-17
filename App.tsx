import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Rabbit, History, Sparkles, AlertCircle, RefreshCw, X, ExternalLink, Heart, Tag, Search, Ghost, Music, Gamepad2, Palette, Monitor, Cpu, ChevronDown, Zap, Gauge, Clock, SwatchBook, BrainCircuit, Dices, Plus, Volume2, VolumeX, Play, Trash2, HelpCircle, Settings, Shuffle, PaintRoller, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Site, Category, FetchStatus, CuratorPersona, AIModel, Aesthetic, TimeEra } from './types';
import { INITIAL_SITES, CATEGORY_COLORS, CURATOR_PERSONAS, AI_MODELS, AESTHETICS, TIME_ERAS } from './constants';
import { fetchRecommendations, searchSites, findSimilarSites, getSiteAnalysis } from './services/geminiService';
import { SiteCard } from './components/SiteCard';

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
  { id: 'spooky', label: 'Spooky', icon: Ghost, query: 'scary creepy unsettling websites' },
  { id: 'zen', label: 'Zen Mode', icon: Music, query: 'relaxing ambient peaceful interactive websites' },
  { id: 'retro', label: '90s Web', icon: Gamepad2, query: '90s geocities nostalgia web design' },
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
  const [showConfig, setShowConfig] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [history, setHistory] = useLocalStorage<Site[]>('rabbithole_history', []);
  const [favorites, setFavorites] = useLocalStorage<Site[]>('rabbithole_favorites', []);
  const [siteQueue, setSiteQueue] = useState<Site[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [submittedSites, setSubmittedSites] = useLocalStorage<any[]>('rabbithole_submissions', []);
  const [soundEnabled, setSoundEnabled] = useLocalStorage('rabbithole_sound', true);
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
      const newSites = await fetchRecommendations(category, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, 25, selectedTag);
      setSiteQueue(prev => [...prev, ...newSites]);
    } catch (e) {
      console.warn("Background fetch failed", e);
    }
  }, [activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, selectedTag]); 

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const q = overrideQuery || searchQuery;
    if (!q.trim()) return;

    if (overrideQuery) setSearchQuery(overrideQuery);

    playSound('static');
    setStatus('loading');
    setShowWelcome(false);
    setIsSearchActive(true);
    setCurrentAnalysis(null);
    setSiteQueue([]); 
    setSearchResults(null);

    try {
      let results = await searchSites(q, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, 15); // Adjust to 15 for grids
      
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
      } else {
        setStatus('idle');
        setSearchQuery("");
      }
    } catch (err: any) {
      console.error(err);
      setGlobalError(err.message || "An unknown anomaly occurred in the neural link.");
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
    setSiteQueue([]);
    setCurrentAnalysis(null);
    setIsSearchActive(true);
    setSearchQuery(`Similar to: ${site.title}`);
    
    try {
      let results = await findSimilarSites(site.url, site.title, activeModel, thinkingBudget, activeAesthetic, activeEra, 25);
      
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
        setGlobalError(err.message || "An unknown anomaly occurred in the neural link.");
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
          setCurrentAnalysis(e.message || "Neural link severed. Local analysis unavailable.");
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
      const newSites = await fetchRecommendations(selectedCategory, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, 25, selectedTag);
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
  }, [selectedCategory, selectedTag, siteQueue, fallbackStumble, fetchMoreSites, addToHistory, isSearchActive, searchQuery, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra]); // handleSearch intentionally omitted to prevent circular dependency unless memoized properly, but we can safely call it using the current state values inside the callback.

  useEffect(() => {
    setSiteQueue([]);
  }, [activePersona, activeModel, activeAesthetic, activeEra]);

  const NeuralLoading = () => (
    <motion.div 
       initial={{ opacity: 0, scale: 0.9 }}
       animate={{ opacity: 1, scale: 1 }}
       className="text-center relative flex flex-col items-center"
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
             <BrainCircuit className={activeAesthetic.styles.accent} size={32} />
          </div>
       </div>
       
       <div className="space-y-4 max-w-sm w-full mx-auto">
          <motion.div 
             animate={{ opacity: [0.4, 1, 0.4] }} 
             transition={{ duration: 1.5, repeat: Infinity }}
             className={`font-display text-2xl tracking-[0.3em] font-black uppercase text-glow ${activeAesthetic.styles.text}`}
          >
             Decrypting
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
             <RefreshCw size={10} className="animate-spin" /> Cross-referencing {activeEra.name} archives
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
    <div className={`min-h-screen ${activeAesthetic.styles.bg} ${activeAesthetic.styles.text} font-sans transition-colors duration-700 flex flex-col relative overflow-hidden`}>
      
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

      {/* CRT Scanline Effect */}
      {retroMode && (
        <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
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

         {/* Compact Search */}
         <div className="flex-1 max-w-md hidden sm:block relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search size={14} className={`${activeAesthetic.styles.subText}`} />
             </div>
             <form onSubmit={(e) => handleSearch(e)}>
               <input 
                 ref={searchInputRef}
                 type="text" 
                 placeholder={`Ask ${activePersona.name}...`} 
                 className={`w-full bg-white/5 border border-white/10 ${activeAesthetic.styles.text} text-sm rounded-full focus:bg-white/10 focus:ring-1 focus:ring-current focus:border-transparent block pl-9 p-2 transition-all outline-none backdrop-blur-md`}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </form>
         </div>

         {/* Actions */}
         <div className="flex items-center gap-2 flex-shrink-0 relative">
            <div className={`hidden lg:flex items-center mr-2 px-3 py-1 rounded-full border ${activeAesthetic.styles.border} bg-white/5`}>
                <span className={`text-[9px] font-mono font-bold ${activeAesthetic.styles.text} flex items-center gap-2`}>
                   QUEUE <span className={activeAesthetic.styles.accent}>{siteQueue.length}</span>
                </span>
            </div>

            <button onClick={() => setShowConfig(!showConfig)} className={`p-2 rounded-full transition-colors glass-panel hover:bg-white/10 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                 <Settings size={18} />
             </button>
             
             {showConfig && (
                 <>
                     <div className="fixed inset-0 z-40" onClick={() => setShowConfig(false)}></div>
                     <div className="absolute top-[120%] right-0 w-[90vw] max-w-sm glass-panel rounded-2xl shadow-2xl z-50 p-6 overscroll-contain max-h-[80vh] overflow-y-auto custom-scrollbar border-white/20 backdrop-blur-3xl bg-black/80 origin-top-right animate-fade-in text-left">
                         <div className="flex justify-between items-center mb-6">
                             <h3 className={`font-display font-bold ${activeAesthetic.styles.text}`}>Configuration</h3>
                             <button onClick={() => setShowConfig(false)} className={`${activeAesthetic.styles.subText} hover:text-white`}><X size={20}/></button>
                         </div>

                         {/* Actions Component */}
                         <div className="grid grid-cols-2 gap-2 mb-6">
                            <button onClick={randomizeConfig} className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${activeAesthetic.styles.border} hover:bg-white/10 transition-all ${activeAesthetic.styles.text} text-[10px] font-bold uppercase tracking-wider`}>
                                <Shuffle size={14} className={activeAesthetic.styles.accent} /> Roll Dice
                            </button>
                            <button onClick={() => { setRetroMode(!retroMode); playSound('blip'); }} className={`flex items-center justify-center gap-2 p-3 rounded-xl border ${activeAesthetic.styles.border} transition-all ${retroMode ? `bg-white/20 ${activeAesthetic.styles.accent}` : `hover:bg-white/10 ${activeAesthetic.styles.text}`} text-[10px] font-bold uppercase tracking-wider`}>
                                <Monitor size={14} /> Screen FX
                            </button>
                         </div>

                         {/* Aesthetic Selector */}
                         <div className={`mb-6`}>
                             <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-widest mb-3 flex items-center gap-2`}><PaintRoller size={12}/> Visual Cortex</div>
                             <div className="grid grid-cols-2 gap-2">
                                 {AESTHETICS.map(a => (
                                     <button
                                         key={a.id}
                                         onClick={() => { setActiveAesthetic(a); playSound('blip'); }}
                                         className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${activeAesthetic.id === a.id ? `${a.styles.border} bg-white/20 ${a.styles.text}` : `border-transparent bg-white/5 hover:bg-white/10 ${activeAesthetic.styles.subText}`}`}
                                     >
                                         <SwatchBook size={16} className={activeAesthetic.id === a.id ? a.styles.accent : ''} />
                                         <span className="text-[10px] font-bold">{a.name}</span>
                                     </button>
                                 ))}
                             </div>
                         </div>

                         {/* Era Selector */}
                         <div className={`mb-6`}>
                             <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-widest mb-3 flex items-center gap-2`}><Clock size={12}/> Chronology</div>
                             <div className="flex flex-wrap gap-2">
                                 {TIME_ERAS.map(era => (
                                     <button
                                         key={era.id}
                                         onClick={() => { setActiveEra(era); playSound('blip'); }}
                                         className={`px-3 py-1.5 rounded-full text-[10px] border transition-all font-mono tracking-wider uppercase ${activeEra.id === era.id ? `${activeAesthetic.styles.border} bg-white/20 ${activeAesthetic.styles.text}` : `border-transparent bg-white/5 hover:bg-white/10 ${activeAesthetic.styles.subText}`}`}
                                     >
                                         {era.name}
                                     </button>
                                 ))}
                             </div>
                         </div>

                         {/* Persona Selector */}
                         <div className={`mb-6`}>
                             <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-widest mb-3 flex items-center gap-2`}><Terminal size={12} /> Curator Persona</div>
                             <div className="space-y-2">
                                {CURATOR_PERSONAS.map(persona => (
                                    <button
                                        key={persona.id}
                                        onClick={() => { setActivePersona(persona); playSound('blip'); }}
                                        className={`w-full text-left p-3 rounded-xl transition-all border ${activePersona.id === persona.id ? `${activeAesthetic.styles.border} bg-white/20` : `border-transparent bg-white/5 hover:bg-white/10`}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <div className={`font-bold flex items-center gap-2 ${activePersona.id === persona.id ? activeAesthetic.styles.text : activeAesthetic.styles.subText}`}>
                                                <div className={`w-2 h-2 rounded-full ${persona.color}`}></div>
                                                {persona.name}
                                            </div>
                                        </div>
                                        {activePersona.id === persona.id && (
                                            <div className={`text-[10px] mt-2 leading-relaxed ${activeAesthetic.styles.subText} font-mono mix-blend-screen`}>
                                                {persona.description}
                                            </div>
                                        )}
                                    </button>
                                ))}
                             </div>
                         </div>

                         {/* Model Selector */}
                         <div className={`mb-6`}>
                             <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-widest mb-3 flex items-center gap-2`}><Cpu size={12} /> Neural Engine</div>
                             <div className="space-y-2">
                                {AI_MODELS.map(model => (
                                    <button
                                        key={model.id}
                                        onClick={() => { setActiveModel(model); playSound('blip'); }}
                                        className={`w-full text-left p-3 rounded-xl transition-all border ${activeModel.id === model.id ? `${activeAesthetic.styles.border} bg-white/20 ${activeAesthetic.styles.highlight}` : `border-transparent bg-white/5 hover:bg-white/10 ${activeAesthetic.styles.subText}`}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold flex items-center gap-2 text-xs">
                                                {model.name}
                                                {model.isExperimental && <span className="text-[9px] bg-purple-500/50 px-1 rounded text-white">EXP</span>}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                             </div>
                         </div>

                         {/* Thinking Config */}
                         {activeModel.supportsThinking && (
                             <div className={`mb-6`}>
                                 <div className="flex justify-between items-center mb-2">
                                     <div className={`text-[10px] font-mono ${activeAesthetic.styles.subText} uppercase tracking-widest`}>Thinking Budget</div>
                                     <div className={`text-[10px] font-mono ${activeAesthetic.styles.accent}`}>{thinkingBudget}</div>
                                 </div>
                                 <input 
                                    type="range" 
                                    min="0" 
                                    max={activeModel.maxThinkingBudget} 
                                    step="1024"
                                    value={thinkingBudget}
                                    onChange={(e) => setThinkingBudget(Number(e.target.value))}
                                    className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-current"
                                 />
                             </div>
                         )}

                         {/* Advanced Toggles */}
                         <div className="grid grid-cols-2 gap-2 mt-6">
                            <button onClick={() => setSoundEnabled(!soundEnabled)} className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center gap-2 ${soundEnabled ? activeAesthetic.styles.text : activeAesthetic.styles.subText}`}>
                               {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                               <span className="text-[10px] font-mono uppercase tracking-widest">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                            </button>
                            <button onClick={() => setIsHelpModalOpen(true)} className={`p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex flex-col items-center gap-2 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                               <HelpCircle size={16} />
                               <span className="text-[10px] font-mono uppercase tracking-widest">Shortcuts</span>
                            </button>
                         </div>
                     </div>
                 </>
             )}

            <button onClick={() => setIsSidebarOpen(true)} className={`p-2 rounded-full transition-colors glass-panel hover:bg-white/10 hidden sm:block ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text} relative`} title="History & Favorites">
              <History size={18} />
              {favorites.length > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>}
            </button>

            <button onClick={handleStumble} disabled={status === 'loading'} className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2 rounded-full font-bold transition-all transform active:scale-95 shadow-lg ${activeAesthetic.id === 'solar' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : activeAesthetic.id === 'vapor' ? 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white' : activeAesthetic.id === 'brutal' ? 'bg-lime-500 hover:bg-lime-400 text-black' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
              {status === 'loading' ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span className="hidden sm:inline text-sm">Stumble</span>
            </button>
         </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden">
        
        {/* Decorative Blobs - Colored based on aesthetic */}
        <div className={`absolute top-0 right-[10%] w-[40rem] h-[40rem] rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob ${activeAesthetic.id === 'solar' ? 'bg-yellow-500' : activeAesthetic.id === 'vapor' ? 'bg-cyan-500' : activeAesthetic.id === 'brutal' ? 'bg-gray-400' : 'bg-purple-600'}`}></div>
        <div className={`absolute -bottom-[20%] left-[-10%] w-[50rem] h-[50rem] rounded-full mix-blend-screen filter blur-[120px] opacity-10 animate-blob animation-delay-4000 ${activeAesthetic.id === 'solar' ? 'bg-emerald-500' : activeAesthetic.id === 'vapor' ? 'bg-pink-500' : activeAesthetic.id === 'brutal' ? 'bg-gray-600' : 'bg-indigo-600'}`}></div>

        {showWelcome ? (
          <AnimatePresence mode="wait">
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center justify-center w-full max-w-7xl px-4 pt-16 z-10 min-h-[85vh]"
          >
             {/* Huge Cinematic Hero */}
             <motion.h1 
                className={`text-[12vw] sm:text-[10vw] md:text-9xl font-black font-display text-center leading-[0.8] tracking-tighter ${activeAesthetic.styles.text} text-glow uppercase`}
             >
                Rabbit<span className={activeAesthetic.styles.accent}>Hole</span>.
             </motion.h1>

             <motion.p className={`mt-8 text-xl md:text-2xl font-light ${activeAesthetic.styles.subText} text-center max-w-2xl mix-blend-screen`}>
                 Descend into the obscure. An AI-curated index of the internet’s finest buried anomalies from {activeEra.name}.
             </motion.p>
             
             {/* Giant Search Command */}
             <motion.div className="w-full max-w-3xl mt-12 relative z-20">
                <form onSubmit={(e) => handleSearch(e)} className="relative group">
                    <div className={`absolute -inset-1 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${activeAesthetic.styles.highlight.replace('text-', 'bg-')}`}></div>
                    <div className="relative glass-pill flex items-center p-3 pl-6">
                        <Search size={24} className={`${activeAesthetic.styles.accent} mr-4 animate-pulse`} />
                        <input 
                            ref={searchInputRef}
                            type="text"
                            placeholder={`Ask ${activePersona.name} to find...`}
                            className={`flex-1 bg-transparent border-none text-xl md:text-2xl ${activeAesthetic.styles.text} outline-none placeholder-white/30`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className={`hidden md:block py-3 px-8 rounded-full font-bold ml-4 transition-transform hover:scale-105 active:scale-95 text-white ${activeAesthetic.id === 'solar' ? 'bg-emerald-600' : activeAesthetic.id === 'brutal' ? 'bg-lime-500 text-black' : 'bg-indigo-600'}`}>
                           Initiate
                        </button>
                    </div>
                </form>
             </motion.div>

             {/* Quick Filters Grid (Replaces old clunky buttons) */}
             <motion.div className="mt-16 w-full max-w-5xl">
                <div className="flex items-center justify-between mb-6">
                   <h3 className={`font-mono text-xs tracking-[0.3em] uppercase ${activeAesthetic.styles.subText}`}>Navigation Nodes</h3>
                   <button onClick={handleStumble} className={`flex items-center gap-2 text-xs font-mono font-bold tracking-widest ${activeAesthetic.styles.accent} hover:text-white transition-colors`}>
                      <Sparkles size={14}/> I'm Feeling Lucky
                   </button>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                   {COLLECTIONS.map((cat, i) => (
                      <motion.button 
                         key={cat.id}
                         onClick={() => handleSearch(undefined, cat.query)}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: i * 0.1 }}
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
                </div>
             </motion.div>
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
            {status === 'loading' ? (
              <NeuralLoading />
            ) : searchResults ? (
              <div className="w-full mx-auto px-4 mt-8 relative z-10 w-full animate-fade-in">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className={`text-4xl font-display font-black tracking-tight ${activeAesthetic.styles.text} mb-2`}>Search Results</h2>
                        <p className={`text-sm ${activeAesthetic.styles.subText} font-mono uppercase tracking-widest`}>
                            Query: <span className="text-white">"{searchQuery}"</span>
                        </p>
                    </div>
                    <button onClick={() => { setIsSearchActive(false); setSearchQuery(''); setSearchResults(null); handleStumble(); }} className={`px-4 py-2 rounded-lg border ${activeAesthetic.styles.border} hover:bg-white/5 ${activeAesthetic.styles.text} font-bold text-sm flex items-center gap-2 transition-colors`}>
                        <X size={16}/> Clear Results
                    </button>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {searchResults.map((site, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={site.id} 
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
                                   Access Node &rarr;
                               </div>
                           </div>
                        </motion.div>
                    ))}
                 </div>
              </div>
            ) : currentSite ? (
              <div className="w-full">
                 {isSearchActive && (
                    <div className="flex justify-center mb-4">
                        <span className={`${activeAesthetic.styles.cardBg} ${activeAesthetic.styles.text} border ${activeAesthetic.styles.border} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2`}>
                            <Search size={12} /> Results for: "{searchQuery}"
                            <button onClick={() => { setIsSearchActive(false); setSearchQuery(''); handleStumble(); }} className="hover:opacity-50"><X size={12}/></button>
                        </span>
                    </div>
                 )}
                 <SiteCard 
                    site={currentSite} 
                    aesthetic={activeAesthetic}
                    persona={activePersona}
                    era={activeEra}
                    isFavorite={favorites.some(f => f.id === currentSite.id)}
                    onToggleFavorite={(s) => { playSound('blip'); toggleFavorite(s); }}
                    onVisit={() => window.open(currentSite.url, '_blank')}
                    onTagClick={handleTagClick}
                    onFindSimilar={handleFindSimilar}
                    onAnalyze={handleAnalyzeSite}
                    selectedTag={selectedTag}
                    analysisText={currentAnalysis}
                    isAnalyzing={isAnalyzing}
                 />
              </div>
            ) : (
               <div className={`text-center ${activeAesthetic.styles.subText}`}>
                 <AlertCircle size={48} className="mx-auto mb-2 opacity-50" />
                 <p className="mb-4">Signal lost. The weird web is vast, but sometimes empty.</p>
                 <div className="flex gap-4 justify-center">
                    <button onClick={() => { setSelectedTag(null); setSelectedCategory(Category.ALL); setIsSearchActive(false); setSearchQuery(''); playSound('blip'); }} className="hover:text-white underline">Clear All Filters</button>
                    <button onClick={handleStumble} className={`${activeAesthetic.styles.accent} hover:underline`}>Retry</button>
                 </div>
               </div>
            )}
          </motion.div>
          </AnimatePresence>
        )}

        {/* Mobile Stumble FAB */}
        {!showWelcome && (
          <button 
            onClick={handleStumble}
            className={`sm:hidden fixed bottom-6 right-6 z-50 ${activeAesthetic.id === 'solar' ? 'bg-emerald-600' : activeAesthetic.id === 'vapor' ? 'bg-fuchsia-600' : activeAesthetic.id === 'brutal' ? 'bg-lime-600 text-black' : 'bg-indigo-600'} text-white p-4 rounded-full shadow-2xl active:scale-90 transition-transform`}
          >
            {status === 'loading' ? <RefreshCw className="animate-spin" /> : <Sparkles />}
          </button>
        )}
      </main>

      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-80 glass-panel border-l ${activeAesthetic.styles.border} transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl flex flex-col backdrop-blur-3xl bg-black/80`}>
        <div className={`p-6 border-b ${activeAesthetic.styles.border} flex justify-between items-center`}>
          <h2 className={`font-display font-bold text-xl uppercase tracking-widest ${activeAesthetic.styles.text}`}>Terminal Log</h2>
          <button onClick={() => setIsSidebarOpen(false)} className={`p-2 rounded-full glass-panel hover:bg-white/10 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
            <X size={18} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <div className="md:hidden flex flex-col gap-3 mb-8">
               <button 
                  onClick={() => {
                     setIsSidebarOpen(false);
                     setIsSubmitModalOpen(true);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${activeAesthetic.styles.border} bg-white/5 ${activeAesthetic.styles.text} hover:bg-white/10 transition-colors font-mono text-xs uppercase tracking-widest`}
               >
                  <Plus size={16} className={activeAesthetic.styles.accent} />
                  Submit Node
               </button>
               <button 
                  onClick={() => {
                     setIsSidebarOpen(false);
                     setSelectedTag(null);
                     setSelectedCategory(Category.ALL);
                     setSearchQuery('');
                     setIsSearchActive(false);
                     handleStumble();
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border ${activeAesthetic.styles.border} bg-white/5 ${activeAesthetic.styles.text} hover:bg-white/10 transition-colors font-mono text-xs uppercase tracking-widest`}
               >
                  <Dices size={16} className={activeAesthetic.styles.accent} />
                  Feeling Lucky
               </button>
               <button 
                  onClick={() => {
                     setIsSidebarOpen(false);
                     setIsHelpModalOpen(true);
                  }}
                  className={`xl:hidden flex items-center gap-3 p-4 rounded-xl border ${activeAesthetic.styles.border} bg-white/5 ${activeAesthetic.styles.text} hover:bg-white/10 transition-colors font-mono text-xs uppercase tracking-widest`}
               >
                  <HelpCircle size={16} className={activeAesthetic.styles.accent} />
                  Sys Help
               </button>
          </div>

          {favorites.length > 0 && (
             <div className="mb-10">
               <div className="flex justify-between items-center mb-4">
                 <h3 className={`text-[10px] font-mono font-bold ${activeAesthetic.styles.subText} uppercase tracking-widest flex items-center gap-2`}>
                   <Heart size={10} className="text-pink-500" /> Saved Nodes
                 </h3>
                 <button onClick={() => setFavorites([])} className={`text-[10px] uppercase font-mono ${activeAesthetic.styles.subText} hover:text-red-400 transition-colors flex items-center gap-1`} title="Clear ALL Favorites">
                    <Trash2 size={10} /> Clear
                 </button>
               </div>
               <div className="space-y-3">
                 {favorites.map((site, i) => (
                   <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={site.id} 
                      className={`bg-white/5 rounded-xl p-4 border border-white/5 hover:${activeAesthetic.styles.border} transition-colors group cursor-pointer`} 
                      onClick={() => { setCurrentSite(site); setIsSidebarOpen(false); setShowWelcome(false); }}
                   >
                      <div className="flex justify-between items-start">
                        <h4 className={`font-bold ${activeAesthetic.styles.text} text-sm line-clamp-1`}>{site.title}</h4>
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(site); }} className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={14} />
                        </button>
                      </div>
                      <p className={`text-xs ${activeAesthetic.styles.subText} mt-2 line-clamp-2 leading-relaxed`}>{site.description}</p>
                   </motion.div>
                 ))}
               </div>
             </div>
          )}

          <div>
             <div className="flex justify-between items-center mb-4">
               <h3 className={`text-[10px] font-mono font-bold ${activeAesthetic.styles.subText} uppercase tracking-widest flex items-center gap-2`}>
                 <History size={10} /> Session Log
               </h3>
               {history.length > 0 && (
                 <button onClick={() => setHistory([])} className={`text-[10px] uppercase font-mono ${activeAesthetic.styles.subText} hover:text-red-400 transition-colors flex items-center gap-1`} title="Clear History">
                    <Trash2 size={10} /> Clear
                 </button>
               )}
             </div>
             <div className="space-y-3">
               {history.map((site, idx) => (
                 <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
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
               {history.length === 0 && (
                 <p className={`text-sm ${activeAesthetic.styles.subText} italic text-center py-4`}>No stumbles yet.</p>
               )}
             </div>
          </div>
        </div>
      </div>
      
      {/* Overlay for Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* Submit Modal */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className={`w-full max-w-md ${activeAesthetic.styles.cardBg} border ${activeAesthetic.styles.border} rounded-xl p-6 shadow-2xl relative animate-fade-in`}>
              <button onClick={() => setIsSubmitModalOpen(false)} className={`absolute top-4 right-4 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                 <X size={20} />
              </button>
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
                 
                 <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${activeAesthetic.styles.subText} mb-1`}>Title</label>
                    <input name="title" required className={`w-full bg-black/30 border ${activeAesthetic.styles.border} rounded p-2 text-sm ${activeAesthetic.styles.text}`} placeholder="Site Title" />
                 </div>
                 
                 <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${activeAesthetic.styles.subText} mb-1`}>URL</label>
                    <input name="url" type="url" required className={`w-full bg-black/30 border ${activeAesthetic.styles.border} rounded p-2 text-sm ${activeAesthetic.styles.text}`} placeholder="https://..." />
                 </div>

                 <div>
                    <label className={`block text-xs font-bold uppercase tracking-wider ${activeAesthetic.styles.subText} mb-1`}>Description</label>
                    <textarea name="description" required rows={3} className={`w-full bg-black/30 border ${activeAesthetic.styles.border} rounded p-2 text-sm ${activeAesthetic.styles.text}`} placeholder="What makes it weird?" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
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
                 </div>

                 <button type="submit" className={`w-full mt-4 ${activeAesthetic.styles.accent.replace('text-', 'bg-')} text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity`}>
                    Archive Site
                 </button>
              </form>

              {submittedSites.length > 0 && (
                 <div className="mt-8 pt-6 border-t border-white/10">
                    <h3 className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider mb-3`}>Your Submissions</h3>
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                       {submittedSites.map(s => (
                          <div key={s.id} className="text-xs flex justify-between items-center p-2 rounded bg-white/5">
                             <span className={`font-medium ${activeAesthetic.styles.text} truncate max-w-[200px]`}>{s.title}</span>
                             <span className={activeAesthetic.styles.subText}>{new Date(s.submittedAt).toLocaleDateString()}</span>
                          </div>
                       ))}
                    </div>
                 </div>
              )}
           </div>
        </div>
      )}

      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsHelpModalOpen(false)}>
           <div className={`w-full max-w-sm ${activeAesthetic.styles.cardBg} border ${activeAesthetic.styles.border} rounded-xl p-6 shadow-2xl relative animate-fade-in`} onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsHelpModalOpen(false)} className={`absolute top-4 right-4 ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
                 <X size={20} />
              </button>
              <h2 className={`text-2xl font-bold font-display ${activeAesthetic.styles.text} mb-4 flex items-center gap-2`}>
                <Ghost size={24} className={activeAesthetic.styles.accent} />
                Terminal Manual
              </h2>
              
              <div className="space-y-4">
                 <div className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Stumble Forward</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>Space</kbd>
                 </div>
                 <div className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Stumble Forward</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>→</kbd>
                 </div>
                 <div className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Go Back</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>←</kbd>
                 </div>
                 <div className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Focus Search</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>/</kbd>
                 </div>
                 <div className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Toggle Sound</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>M</kbd>
                 </div>
                 <div className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Favorite Site</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>F</kbd>
                 </div>
                 <div className={`flex justify-between items-center text-sm ${activeAesthetic.styles.text}`}>
                    <span>Toggle Help Info</span>
                    <kbd className={`px-2 py-1 bg-black/40 border ${activeAesthetic.styles.border} rounded font-mono text-xs text-white`}>?</kbd>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Global Error Banner */}
      {globalError && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
              <div className="bg-red-900/90 text-white px-6 py-3 rounded-xl shadow-2xl border border-red-500 flex items-center gap-3 backdrop-blur-sm max-w-sm sm:max-w-md w-full">
                  <AlertCircle size={20} className="text-red-400 shrink-0" />
                  <p className="text-sm font-medium leading-tight">{globalError}</p>
                  <button onClick={() => setGlobalError(null)} className="ml-auto p-1 hover:bg-white/10 rounded">
                      <X size={16} />
                  </button>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;