import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Rabbit, History, Sparkles, AlertCircle, RefreshCw, X, ExternalLink, Heart, Tag, Search, Ghost, Music, Gamepad2, Palette, Monitor, Cpu, ChevronDown, Zap, Gauge, Clock, SwatchBook, BrainCircuit, Dices, Plus, Volume2, VolumeX, Play, Trash2, HelpCircle } from 'lucide-react';
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
      const newSites = await fetchRecommendations(category, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, 25);
      setSiteQueue(prev => [...prev, ...newSites]);
    } catch (e) {
      console.warn("Background fetch failed", e);
    }
  }, [activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra]); 

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
    } catch (err) {
      console.error(err);
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
    } catch (err) {
        console.error(err);
        setStatus('error');
    }
  };

  const handleAnalyzeSite = async (site: Site) => {
      setIsAnalyzing(true);
      setCurrentAnalysis(null);
      try {
          const analysis = await getSiteAnalysis(site, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra);
          setCurrentAnalysis(analysis);
      } catch (e) {
          setCurrentAnalysis("Neural link severed. Local analysis unavailable.");
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

    if (siteQueue.length > 0 && !selectedTag) {
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

    if (selectedTag) {
        fallbackStumble();
        return;
    }

    try {
      const newSites = await fetchRecommendations(selectedCategory, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra, 25);
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
    } catch (e) {
      console.error(e);
      fallbackStumble();
    }
  }, [selectedCategory, selectedTag, siteQueue, fallbackStumble, fetchMoreSites, addToHistory, isSearchActive, searchQuery, activePersona, activeModel, thinkingBudget, activeAesthetic, activeEra]); // handleSearch intentionally omitted to prevent circular dependency unless memoized properly, but we can safely call it using the current state values inside the callback.

  useEffect(() => {
    setSiteQueue([]);
  }, [activePersona, activeModel, activeAesthetic, activeEra]);

  const NeuralLoading = () => (
    <div className="text-center relative">
       <div className="relative w-32 h-32 mx-auto mb-8">
          <div className={`absolute inset-0 rounded-full border-4 ${activeAesthetic.styles.border} border-t-transparent animate-spin`} />
          <div className={`absolute inset-2 rounded-full border-4 ${activeAesthetic.styles.border} border-b-transparent animate-spin-reverse opacity-50`} />
          <div className="absolute inset-0 flex items-center justify-center">
             <BrainCircuit className={`${activeAesthetic.styles.accent} animate-pulse`} size={40} />
          </div>
       </div>
       <div className="space-y-2">
          <p className={`${activeAesthetic.styles.text} font-display animate-pulse text-2xl tracking-[0.2em] font-bold uppercase`}>
             Neural Link Established
          </p>
          <p className={`${activeAesthetic.styles.subText} text-xs font-mono uppercase tracking-widest`}>
             Sourcing from {activeEra.name} matrix...
          </p>
          {activeModel.supportsThinking && thinkingBudget > 0 && (
             <div className={`inline-flex items-center gap-2 mt-4 px-3 py-1 rounded-full bg-black/30 border ${activeAesthetic.styles.border}`}>
                <Zap size={12} className={activeAesthetic.styles.highlight} />
                <span className={`text-[10px] font-mono ${activeAesthetic.styles.text}`}>Thinking Budget: {thinkingBudget} tokens</span>
             </div>
          )}
       </div>
    </div>
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

      {/* Header */}
      <header className={`sticky top-0 z-40 w-full border-b ${activeAesthetic.styles.border} ${activeAesthetic.styles.bg}/80 backdrop-blur-md transition-colors duration-700`}>
        {/* Category Filter Bar */}
        <div className={`w-full overflow-x-auto no-scrollbar border-b ${activeAesthetic.styles.border} py-2 px-4 bg-black/5`}>
          <div className="max-w-7xl mx-auto flex gap-4 min-w-max">
            {Object.values(Category).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full transition-all border ${selectedCategory === cat ? `${activeAesthetic.styles.accent.replace('text-', 'bg-')} text-white border-transparent` : `${activeAesthetic.styles.subText} border-transparent hover:border-current hover:${activeAesthetic.styles.text}`}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => { setShowWelcome(true); playSound('blip'); }}>
            <div className={`p-2 rounded-lg ${activeAesthetic.id === 'solar' ? 'bg-emerald-600 text-white' : activeAesthetic.id === 'vapor' ? 'bg-fuchsia-600 text-white' : activeAesthetic.id === 'brutal' ? 'bg-lime-600 text-black' : 'bg-indigo-600 text-white'}`}>
              <Rabbit size={24} />
            </div>
            <span className={`font-display font-bold text-xl tracking-tight hidden md:block ${activeAesthetic.styles.text}`}>
              Rabbit<span className={activeAesthetic.styles.accent}>Hole</span>
            </span>
          </div>

          <div className="flex-1 max-w-md hidden sm:block relative group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Search size={16} className={`${activeAesthetic.styles.subText}`} />
             </div>
             <form onSubmit={(e) => handleSearch(e)}>
               <input 
                 ref={searchInputRef}
                 type="text" 
                 placeholder={`Ask ${activePersona.name}...`} 
                 className={`w-full ${activeAesthetic.styles.cardBg} border ${activeAesthetic.styles.border} ${activeAesthetic.styles.text} text-sm rounded-lg focus:ring-2 focus:ring-current focus:border-transparent block pl-10 p-2.5 transition-all outline-none`}
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </form>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
             
             {/* Queue Status */}
             {!showWelcome && (
               <div className={`hidden md:flex flex-col items-end mr-2 px-3 py-1 rounded border ${activeAesthetic.styles.border} bg-black/10`}>
                 <div className="flex items-center gap-2">
                   <div className="flex gap-0.5">
                     {[...Array(5)].map((_, i) => (
                       <div key={i} className={`w-1 h-3 rounded-full ${i < Math.ceil(siteQueue.length / 5) ? activeAesthetic.styles.accent.replace('text-', 'bg-') : 'bg-gray-700'}`} />
                     ))}
                   </div>
                   <span className={`text-[10px] font-mono font-bold ${activeAesthetic.styles.text}`}>{siteQueue.length} SITES QUEUED</span>
                 </div>
               </div>
             )}

             {/* Config Toggle */}
             <div className="relative">
                 <button 
                    onClick={() => setShowConfig(!showConfig)}
                    className={`flex items-center gap-2 ${activeAesthetic.styles.cardBg} border ${activeAesthetic.styles.border} ${activeAesthetic.styles.text} px-3 py-2 rounded-lg text-sm hover:opacity-80 transition-all`}
                 >
                    <Cpu size={16} className={activeAesthetic.styles.accent}/>
                    <span className="hidden lg:inline">Config</span>
                    <ChevronDown size={14} className={`transition-transform ${showConfig ? 'rotate-180' : ''}`} />
                 </button>

                 {showConfig && (
                     <div className={`absolute top-full right-0 mt-2 w-80 ${activeAesthetic.styles.cardBg} border ${activeAesthetic.styles.border} rounded-xl shadow-2xl p-4 z-50 animate-fade-in max-h-[80vh] overflow-y-auto`}>
                         
                        <div className="mb-4 flex items-center justify-between">
                            <span className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider`}>System Config</span>
                            <button 
                                onClick={randomizeConfig}
                                className={`text-xs flex items-center gap-1 ${activeAesthetic.styles.accent} hover:underline`}
                            >
                                <Dices size={12}/> Randomize
                            </button>
                        </div>

                         {/* Aesthetics Selector */}
                         <div className="mb-4">
                             <div className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider mb-2 flex items-center gap-2`}><SwatchBook size={12}/> Aesthetics</div>
                             <div className="grid grid-cols-4 gap-2">
                                {AESTHETICS.map(aest => (
                                    <button
                                        key={aest.id}
                                        onClick={() => { setActiveAesthetic(aest); playSound('blip'); }}
                                        className={`h-8 rounded-lg border-2 transition-all ${activeAesthetic.id === aest.id ? 'border-current scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                        style={{ backgroundColor: aest.id === 'cyber' ? '#4f46e5' : aest.id === 'vapor' ? '#e879f9' : aest.id === 'solar' ? '#10b981' : '#84cc16' }}
                                        title={aest.name}
                                    />
                                ))}
                             </div>
                         </div>

                        {/* Time Travel */}
                         <div className={`mb-4 pt-4 border-t ${activeAesthetic.styles.border}`}>
                             <div className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider mb-2 flex items-center gap-2`}><Clock size={12}/> Time Travel</div>
                             <div className="space-y-1">
                                {TIME_ERAS.map(era => (
                                    <button
                                        key={era.id}
                                        onClick={() => { setActiveEra(era); playSound('blip'); }}
                                        className={`w-full text-left p-2 rounded-lg text-sm transition-colors flex justify-between items-center ${activeEra.id === era.id ? 'bg-black/20 font-bold' : `hover:bg-black/10 ${activeAesthetic.styles.subText}`}`}
                                    >
                                        <span>{era.name}</span>
                                        <span className="text-[10px] opacity-70">{era.range}</span>
                                    </button>
                                ))}
                             </div>
                         </div>

                         {/* Persona Selector */}
                         <div className={`mb-4 pt-4 border-t ${activeAesthetic.styles.border}`}>
                             <div className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider mb-2`}>Curator Persona</div>
                             <div className="space-y-1">
                                {CURATOR_PERSONAS.map(persona => (
                                    <button
                                        key={persona.id}
                                        onClick={() => { setActivePersona(persona); playSound('blip'); }}
                                        className={`w-full text-left p-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${activePersona.id === persona.id ? 'bg-black/20 font-bold' : `hover:bg-black/10 ${activeAesthetic.styles.subText}`}`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${persona.color}`}></div>
                                        <div className="truncate">{persona.name}</div>
                                    </button>
                                ))}
                             </div>
                         </div>

                         {/* Model Selector */}
                         <div className={`mb-4 pt-4 border-t ${activeAesthetic.styles.border}`}>
                             <div className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider mb-2`}>Neural Engine</div>
                             <div className="space-y-1">
                                {AI_MODELS.map(model => (
                                    <button
                                        key={model.id}
                                        onClick={() => { setActiveModel(model); playSound('blip'); }}
                                        className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${activeModel.id === model.id ? `bg-black/20 ${activeAesthetic.styles.highlight}` : `hover:bg-black/10 ${activeAesthetic.styles.subText}`}`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold flex items-center gap-2 text-xs">
                                                {model.name}
                                                {model.isExperimental && <span className="text-[9px] bg-purple-500/50 px-1 rounded">EXP</span>}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                             </div>
                         </div>

                         {/* Thinking Config */}
                         {activeModel.supportsThinking && (
                             <div className={`mb-4 pt-4 border-t ${activeAesthetic.styles.border}`}>
                                 <div className="flex justify-between items-center mb-2">
                                     <div className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider`}>Thinking Budget</div>
                                     <div className={`text-xs font-mono ${activeAesthetic.styles.accent}`}>{thinkingBudget}</div>
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

                     </div>
                 )}
                 {showConfig && <div className="fixed inset-0 z-40" onClick={() => setShowConfig(false)}></div>}
             </div>

            <button 
                onClick={() => setIsHelpModalOpen(true)}
                className={`p-2 rounded-lg transition-colors hidden xl:block ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}
                title="Keyboard Shortcuts (Hotkeys)"
            >
                <HelpCircle size={20} />
            </button>

            <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg transition-colors hidden sm:block ${soundEnabled ? `bg-black/20 ${activeAesthetic.styles.text}` : `${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}`}
                title={soundEnabled ? "Mute Sounds" : "Enable Sounds"}
            >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            <button 
                onClick={() => setRetroMode(!retroMode)}
                className={`p-2 rounded-lg transition-colors hidden sm:block ${retroMode ? `bg-black/20 ${activeAesthetic.styles.accent}` : `${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}`}
                title="Toggle CRT Mode"
            >
                <Monitor size={20} />
            </button>

            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 hover:bg-black/10 rounded-lg transition-colors ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text} relative`}
              title="History & Favorites"
            >
              <History size={20} />
              {favorites.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full"></span>
              )}
            </button>

            <button 
               onClick={() => setIsSubmitModalOpen(true)}
               className={`hidden md:flex p-2 hover:bg-black/10 rounded-lg transition-colors ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}
               title="Submit a Link"
            >
               <Plus size={20} />
            </button>

            <button 
               onClick={() => {
                   setSelectedTag(null);
                   setSelectedCategory(Category.ALL);
                   setSearchQuery('');
                   setIsSearchActive(false);
                   handleStumble();
               }}
               className={`hidden md:flex p-2 hover:bg-black/10 rounded-lg transition-colors ${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text} cursor-help`}
               title="Feeling Lucky (Pure Random)"
            >
               <Dices size={20} />
            </button>

            <button 
               onClick={() => setAutoStumble(!autoStumble)}
               className={`hidden md:flex p-2 hover:bg-black/10 rounded-lg transition-colors ${autoStumble ? `text-green-500 bg-green-500/10` : `${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}`}
               title={autoStumble ? "Disable Auto-Stumble" : "Enable Auto-Stumble (15s)"}
            >
               <Play size={20} className={autoStumble ? "fill-current" : ""} />
            </button>

            <button 
              onClick={handleStumble}
              disabled={status === 'loading'}
              className={`flex items-center gap-2 ${activeAesthetic.id === 'solar' ? 'bg-emerald-600' : activeAesthetic.id === 'vapor' ? 'bg-fuchsia-600' : activeAesthetic.id === 'brutal' ? 'bg-lime-600 text-black' : 'bg-indigo-600'} text-white font-bold py-2 px-4 sm:px-6 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
            >
              {status === 'loading' ? (
                <RefreshCw className="animate-spin" size={20} />
              ) : (
                <Sparkles size={20} />
              )}
              <span className="hidden sm:inline">Stumble</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        <div className="sm:hidden px-4 pb-3">
             <form onSubmit={(e) => handleSearch(e)} className="relative">
                <input 
                  type="text" 
                  placeholder={`Ask ${activePersona.name}...`} 
                  className={`w-full ${activeAesthetic.styles.cardBg} border ${activeAesthetic.styles.border} ${activeAesthetic.styles.text} text-sm rounded-lg focus:ring-2 focus:ring-current p-2 pl-9`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search size={14} className={`absolute left-3 top-3 ${activeAesthetic.styles.subText}`} />
             </form>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden">
        
        {/* Decorative Blobs - Colored based on aesthetic */}
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob ${activeAesthetic.id === 'solar' ? 'bg-yellow-400' : activeAesthetic.id === 'vapor' ? 'bg-cyan-400' : activeAesthetic.id === 'brutal' ? 'bg-gray-400' : 'bg-purple-600'}`}></div>
        <div className={`absolute top-20 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000 ${activeAesthetic.id === 'solar' ? 'bg-emerald-400' : activeAesthetic.id === 'vapor' ? 'bg-pink-400' : activeAesthetic.id === 'brutal' ? 'bg-gray-600' : 'bg-indigo-600'}`}></div>
        <div className={`absolute -bottom-8 left-20 w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000 ${activeAesthetic.id === 'solar' ? 'bg-orange-400' : activeAesthetic.id === 'vapor' ? 'bg-purple-400' : activeAesthetic.id === 'brutal' ? 'bg-black' : 'bg-pink-600'}`}></div>

        {showWelcome ? (
          <div className="text-center max-w-4xl z-10 animate-fade-in relative px-4">
             <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
             
             <div className={`mb-6 inline-flex items-center justify-center p-4 ${activeAesthetic.styles.cardBg} rounded-2xl border ${activeAesthetic.styles.border} backdrop-blur shadow-2xl relative`}>
                <Rabbit size={48} className={activeAesthetic.styles.accent} />
                <div className="absolute -top-1 -right-1 flex">
                   <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                   </span>
                </div>
             </div>
            <h1 className={`text-5xl md:text-7xl font-display font-bold ${activeAesthetic.styles.text} mb-6 tracking-tighter`}>
              Dive into the <br/>
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeAesthetic.id === 'vapor' ? 'from-cyan-400 to-pink-400' : activeAesthetic.id === 'solar' ? 'from-yellow-400 to-emerald-400' : activeAesthetic.id === 'brutal' ? 'from-gray-100 to-gray-500' : 'from-indigo-400 to-pink-400'}`}>Weird Web</span>
            </h1>
            <p className={`text-xl ${activeAesthetic.styles.subText} mb-10 leading-relaxed max-w-2xl mx-auto`}>
              Break free from the algorithm. Discover curated, obscure, and delightful websites from {activeEra.name}.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={handleStumble}
                className={`group relative inline-flex items-center gap-3 ${activeAesthetic.id === 'brutal' ? 'bg-lime-500 text-black' : 'bg-white text-slate-900'} font-bold py-4 px-8 rounded-xl text-xl hover:opacity-90 transition-all transform hover:-translate-y-1 shadow-2xl w-full sm:w-auto justify-center`}
              >
                <Sparkles className={`group-hover:rotate-12 transition-transform ${activeAesthetic.id === 'brutal' ? 'text-black' : 'text-indigo-600'}`} />
                Start Stumbling
              </button>
            </div>
            
            {/* Collections */}
            <div className={`${activeAesthetic.styles.cardBg}/40 backdrop-blur rounded-2xl border ${activeAesthetic.styles.border} p-6`}>
              <h3 className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider mb-4`}>Curated Collections</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {COLLECTIONS.map(col => (
                  <button 
                    key={col.id}
                    onClick={() => handleSearch(undefined, col.query)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl ${activeAesthetic.styles.cardBg} hover:bg-black/10 transition-all border ${activeAesthetic.styles.border} hover:border-current group min-w-[120px]`}
                  >
                    <col.icon size={24} className={`${activeAesthetic.styles.accent} group-hover:${activeAesthetic.styles.text} transition-colors mb-1`} />
                    <span className={`font-bold text-sm ${activeAesthetic.styles.text}`}>{col.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={`mt-8 ${activeAesthetic.styles.subText} text-xs flex gap-4 justify-center items-center`}>
                 <span>Era: <span className={`${activeAesthetic.styles.accent} font-mono`}>{activeEra.name}</span></span>
                 <span>Aesthetic: <span className={`${activeAesthetic.styles.accent} font-mono`}>{activeAesthetic.name}</span></span>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl z-10 animate-fade-in min-h-[500px] flex items-center justify-center">
            {status === 'loading' ? (
              <NeuralLoading />
            ) : searchResults ? (
              <div className="w-full max-w-6xl mx-auto px-4 mt-8 animate-fade-in relative z-10">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${activeAesthetic.styles.text}`}>Search Results</h2>
                    <button onClick={() => { setIsSearchActive(false); setSearchQuery(''); setSearchResults(null); handleStumble(); }} className={`hover:opacity-80 ${activeAesthetic.styles.subText} flex items-center gap-2`}><X size={16}/> Clear Search</button>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.map(site => (
                        <div 
                          key={site.id} 
                          onClick={() => selectSearchResult(site)}
                          className={`p-4 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] border ${activeAesthetic.styles.border} ${activeAesthetic.styles.cardBg} hover:border-current hover:bg-black/30 group relative overflow-hidden`}
                        >
                           <div className={`absolute -inset-1 opacity-0 group-hover:opacity-10 blur-xl transition-all ${
                             activeAesthetic.id === 'cyber' ? 'bg-pink-500' : 'bg-current'
                           }`}></div>
                           <h3 className={`text-lg font-bold ${activeAesthetic.styles.text} mb-2 line-clamp-1`}>{site.title}</h3>
                           <p className={`text-sm ${activeAesthetic.styles.subText} mb-4 line-clamp-2`}>{site.description}</p>
                           <div className="flex gap-2">
                             <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[site.category] || 'bg-slate-600'} text-white`}>{site.category}</span>
                             {site.vibeScore && <span className={`text-[10px] font-mono border ${activeAesthetic.styles.border} px-2 py-0.5 rounded ${activeAesthetic.styles.highlight}`}>{site.vibeScore}% Vibe</span>}
                           </div>
                        </div>
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
          </div>
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
      <div className={`fixed inset-y-0 right-0 z-50 w-80 ${activeAesthetic.styles.bg} border-l ${activeAesthetic.styles.border} transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl flex flex-col`}>
        <div className={`p-4 border-b ${activeAesthetic.styles.border} flex justify-between items-center ${activeAesthetic.styles.cardBg}/50 backdrop-blur`}>
          <h2 className={`font-display font-bold text-lg ${activeAesthetic.styles.text}`}>Your Journey</h2>
          <button onClick={() => setIsSidebarOpen(false)} className={`${activeAesthetic.styles.subText} hover:${activeAesthetic.styles.text}`}>
            <X size={24} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="md:hidden flex flex-col gap-3 mb-8">
               <button 
                  onClick={() => {
                     setIsSidebarOpen(false);
                     setIsSubmitModalOpen(true);
                  }}
                  className={`flex items-center gap-2 p-3 rounded-lg border ${activeAesthetic.styles.border} ${activeAesthetic.styles.cardBg} ${activeAesthetic.styles.text} hover:opacity-80 transition-colors`}
               >
                  <Plus size={16} className={activeAesthetic.styles.accent} />
                  Submit a Link
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
                  className={`flex items-center gap-2 p-3 rounded-lg border ${activeAesthetic.styles.border} ${activeAesthetic.styles.cardBg} ${activeAesthetic.styles.text} hover:opacity-80 transition-colors`}
               >
                  <Dices size={16} className={activeAesthetic.styles.accent} />
                  Feeling Lucky
               </button>
               <button 
                  onClick={() => {
                     setIsSidebarOpen(false);
                     setIsHelpModalOpen(true);
                  }}
                  className={`xl:hidden flex items-center gap-2 p-3 rounded-lg border ${activeAesthetic.styles.border} ${activeAesthetic.styles.cardBg} ${activeAesthetic.styles.text} hover:opacity-80 transition-colors`}
               >
                  <HelpCircle size={16} className={activeAesthetic.styles.accent} />
                  Help / Shortcuts
               </button>
               <button 
                  onClick={() => {
                     setSoundEnabled(!soundEnabled);
                  }}
                  className={`sm:hidden flex items-center gap-2 p-3 rounded-lg border ${activeAesthetic.styles.border} ${activeAesthetic.styles.cardBg} ${activeAesthetic.styles.text} hover:opacity-80 transition-colors`}
               >
                  {soundEnabled ? <Volume2 size={16} className={activeAesthetic.styles.accent} /> : <VolumeX size={16} className={activeAesthetic.styles.accent} />}
                  {soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
               </button>
          </div>

          {favorites.length > 0 && (
             <div className="mb-8">
               <div className="flex justify-between items-center mb-3">
                 <h3 className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider flex items-center gap-2`}>
                   <Heart size={12} className="text-pink-500" /> Favorites
                 </h3>
                 <button onClick={() => setFavorites([])} className={`text-xs ${activeAesthetic.styles.subText} hover:text-red-400 transition-colors flex items-center gap-1`} title="Clear ALL Favorites">
                    <Trash2 size={12} /> Clear
                 </button>
               </div>
               <div className="space-y-3">
                 {favorites.map(site => (
                   <div key={site.id} className={`${activeAesthetic.styles.cardBg} rounded-lg p-3 border ${activeAesthetic.styles.border} hover:border-current transition-colors group cursor-pointer`} onClick={() => { setCurrentSite(site); setIsSidebarOpen(false); setShowWelcome(false); }}>
                      <div className="flex justify-between items-start">
                        <h4 className={`font-bold ${activeAesthetic.styles.text} text-sm line-clamp-1`}>{site.title}</h4>
                        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(site); }} className="text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={14} />
                        </button>
                      </div>
                      <p className={`text-xs ${activeAesthetic.styles.subText} mt-1 line-clamp-2`}>{site.description}</p>
                   </div>
                 ))}
               </div>
             </div>
          )}

          <div>
             <div className="flex justify-between items-center mb-3">
               <h3 className={`text-xs font-bold ${activeAesthetic.styles.subText} uppercase tracking-wider flex items-center gap-2`}>
                 <History size={12} /> Recent Stumbles
               </h3>
               {history.length > 0 && (
                 <button onClick={() => setHistory([])} className={`text-xs ${activeAesthetic.styles.subText} hover:text-red-400 transition-colors flex items-center gap-1`} title="Clear History">
                    <Trash2 size={12} /> Clear
                 </button>
               )}
             </div>
             <div className="space-y-3">
               {history.map((site, idx) => (
                 <div key={`${site.id}-${idx}`} className={`group ${activeAesthetic.styles.cardBg} rounded-lg p-3 border border-transparent hover:${activeAesthetic.styles.border} transition-colors cursor-pointer`} onClick={() => { setCurrentSite(site); setIsSidebarOpen(false); setShowWelcome(false); }}>
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`font-medium ${activeAesthetic.styles.text} text-sm line-clamp-1 group-hover:${activeAesthetic.styles.accent} transition-colors`}>{site.title}</h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${CATEGORY_COLORS[site.category]} text-white/90`}>
                        {site.category.split(' ')[0]}
                      </span>
                    </div>
                    <div className={`flex items-center gap-1 text-xs ${activeAesthetic.styles.subText}`}>
                      <ExternalLink size={10} />
                      <span className="truncate">{new URL(site.url).hostname}</span>
                    </div>
                 </div>
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
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2 no-scrollbar">
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

    </div>
  );
};

export default App;