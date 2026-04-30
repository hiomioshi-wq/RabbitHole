import React, { useState, useEffect, useRef } from 'react';
import { Site, Aesthetic, CuratorPersona, TimeEra } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { ExternalLink, Hash, Calendar, Heart, Share2, Check, Sparkles, BrainCircuit, Loader2, Gauge, Cpu, Palette, Eye, EyeOff, Copy, CheckCheck, Tag, Terminal, Play, Square, Volume2, NotebookPen, Save, X as CloseIcon, Pencil, History } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateSpeech, chatWithPersona } from '../services/geminiService';
import Markdown from 'react-markdown';
import { AIModel } from '../types';
import { AI_MODELS } from '../constants';

interface SiteCardProps {
  site: Site;
  aesthetic: Aesthetic;
  persona: CuratorPersona;
  era: TimeEra;
  isFavorite: boolean;
  onToggleFavorite: (site: Site) => void;
  onUpdateSite?: (site: Site) => void;
  onVisit: () => void;
  onTagClick: (tag: string) => void;
  onFindSimilar?: (site: Site) => void;
  onAnalyze?: (site: Site) => void;
  selectedTag: string | null;
  analysisText?: string | null;
  isAnalyzing?: boolean;
  compactMode?: boolean;
  autoSpeak?: boolean;
}

const ANALYSIS_PHRASES = [
    "Decrypting site intent...",
    "Extracting semantic nodes...",
    "Bypassing mainframe protocols...",
    "Calculating vibe resonance...",
    "Synthesizing assistant insights..."
];

interface ChatMessage {
   role: 'user' | 'model';
   content: string;
}

export const SiteCard: React.FC<SiteCardProps> = React.memo(({ 
  site, 
  aesthetic,
  persona,
  era,
  isFavorite, 
  onToggleFavorite, 
  onUpdateSite,
  onVisit,
  onTagClick,
  onFindSimilar,
  onAnalyze,
  selectedTag,
  analysisText,
  isAnalyzing,
  compactMode = false,
  autoSpeak = false
}) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(site.fieldNote || '');
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState(0);

  useEffect(() => {
    setNoteText(site.fieldNote || '');
  }, [site.fieldNote]);

  const handleSaveNote = () => {
    if (onUpdateSite) {
      onUpdateSite({ ...site, fieldNote: noteText });
    }
    setIsEditingNote(false);
  };

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isPlayingNote, setIsPlayingNote] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isAnalyzing) {
        interval = setInterval(() => {
            setLoadingPhraseIndex(prev => (prev + 1) % ANALYSIS_PHRASES.length);
        }, 1500);
    } else {
        setLoadingPhraseIndex(0);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // Cleanup audio on unmount or when site changes
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [site.id]);

  const stopAudio = () => {
      if (audioSourceRef.current) {
          try { audioSourceRef.current.stop(); } catch (e) {}
          audioSourceRef.current.disconnect();
          audioSourceRef.current = null;
      }
      setIsPlayingNote(false);
      setIsSynthesizing(false);
  };

  useEffect(() => {
     let isActive = true;
     if (autoSpeak && site.curatorNote) {
         // Add a small delay so we don't start speaking immediately on fast scroll
         const timeout = setTimeout(() => {
             if (isActive) {
                 handleSynthesizeNote();
             }
         }, 800);
         return () => { isActive = false; clearTimeout(timeout); };
     }
  }, [site.id, autoSpeak]);

  useEffect(() => {
      if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
  }, [chatHistory, isChatting]);

  const handleChatSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!chatInput.trim() || isChatting) return;

      const userMsg = chatInput.trim();
      setChatInput('');
      const newHistory = [...chatHistory, { role: 'user' as const, content: userMsg }];
      setChatHistory(newHistory);
      setIsChatting(true);

      try {
          const reply = await chatWithPersona(site, persona, AI_MODELS[0], newHistory, userMsg);
          setChatHistory(prev => [...prev, { role: 'model' as const, content: reply }]);
      } catch (err: any) {
          setChatHistory(prev => [...prev, { role: 'model' as const, content: `*[ERR: ${err.message}]*` }]);
      } finally {
          setIsChatting(false);
      }
  };

  const handleSynthesizeNote = async () => {
      if (isPlayingNote) {
          stopAudio();
          return;
      }

      if (!site.curatorNote) return;
      
      try {
          setIsSynthesizing(true);
          
          if (!audioContextRef.current) {
              const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
              if (AudioContext) {
                  audioContextRef.current = new AudioContext();
              }
          }
          
          if (!audioContextRef.current) throw new Error("Audio not supported");

          // Voice selection based on Persona for flavor
          // Default to Kore, unless aggressive or bizarre
          let voiceName = 'Kore';
          if (persona.id === 'chaos_engine' || persona.id === 'void_merchant') voiceName = 'Puck';
          if (persona.id === 'the_archivist' || persona.id === 'zen_core') voiceName = 'Charon';

          const base64Audio = await generateSpeech(site.curatorNote, voiceName);
          const binary = atob(base64Audio);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
          }
          
          const audioBuffer = await audioContextRef.current.decodeAudioData(bytes.buffer);
          
          audioSourceRef.current = audioContextRef.current.createBufferSource();
          audioSourceRef.current.buffer = audioBuffer;
          audioSourceRef.current.connect(audioContextRef.current.destination);
          
          audioSourceRef.current.onended = () => {
              setIsPlayingNote(false);
          };
          
          audioSourceRef.current.start();
          setIsPlayingNote(true);
      } catch (err: any) {
          console.error("Failed to synthesize:", err);
          // Just fail silently for user, the error is logged
      } finally {
          setIsSynthesizing(false);
      }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `🕳️ Down the RabbitHole 🕳️\n\nI discovered: ${site.title}\n"${site.description}"\n\n🎨 Vibe: ${aesthetic.name}\n🕰️ Era: ${era.name}\n🤖 Assistant: ${persona.name}\n\nExplore it here: ${site.url}`;
    
    if (navigator.share) {
        try {
            await navigator.share({
                title: `RabbitHole Discovery: ${site.title}`,
                text: shareText,
                url: site.url
            });
        } catch (err: any) {
            if (err.name !== 'AbortError') {
                console.error("Error sharing:", err);
            }
            // Optional: fallback to clipboard on non-user-abort errors if desired
        }
    } else {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(site.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleAnalyzeClick = () => {
      setShowAnalysis(!showAnalysis);
      if (onAnalyze && !analysisText && !showAnalysis) {
          onAnalyze(site);
      }
  };

  // Extract the main styling blocks for readability
  const isBrutal = aesthetic.id === 'brutal';
  const getGlowClasses = () => {
    switch (aesthetic.id) {
      case 'cyber': return 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600';
      case 'vapor': return 'bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400';
      case 'solar': return 'bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400';
      case 'matrix': return 'bg-gradient-to-r from-green-900 via-green-400 to-green-900';
      case 'academic': return 'bg-gradient-to-r from-amber-700 via-amber-200 to-amber-900';
      case 'blood': return 'bg-gradient-to-r from-red-900 via-red-600 to-red-900';
      case 'circuit': return 'bg-gradient-to-r from-blue-900 via-cyan-400 to-blue-900';
      case 'pixel': return 'bg-gradient-to-br from-green-500 via-yellow-500 to-red-500';
      case 'gothic_digital': return 'bg-gradient-to-r from-fuchsia-900 via-fuchsia-600 to-fuchsia-900';
      case 'bio': return 'bg-gradient-to-r from-emerald-900 via-lime-400 to-emerald-900';
      case 'industrial': return 'bg-gradient-to-r from-orange-950 via-orange-600 to-orange-950';
      case 'holy': return 'bg-gradient-to-r from-amber-200 via-white to-amber-200';
      default: return 'bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600';
    }
  };
  const glowClasses = getGlowClasses();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring', bounce: 0.4 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
      className="relative w-full max-w-4xl mx-auto group perspective-1000 z-10"
    >
      {/* Background Glow Effect - Dynamic based on Aesthetic */}
      {!isBrutal && (
        <div className={`absolute -inset-1 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 ${glowClasses}`}></div>
      )}
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`relative ${aesthetic.styles.cardBg} ${!isBrutal && 'backdrop-blur-xl'} ${isBrutal ? 'border-4' : 'border'} ${aesthetic.styles.border} ${isBrutal ? 'rounded-none' : 'rounded-3xl'} ${compactMode ? 'p-4 sm:p-6' : 'p-6 sm:p-10'} shadow-2xl overflow-hidden flex flex-col justify-between transform transition-all duration-500 ease-out md:hover:-translate-y-2 md:hover:shadow-[0_30px_80px_currentColor]`}
      >
        
        {/* Decorative Grid/Watermark */}
        <motion.div 
          whileHover={{ rotate: 180, scale: 1.1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className={`absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none ${aesthetic.styles.text}`}
        >
          <Hash size={400} className="transform rotate-12 translate-x-1/4 -translate-y-1/4" />
        </motion.div>

        {/* Top Header Row */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
             <motion.span 
               whileHover={{ scale: 1.05 }}
               className={`${CATEGORY_COLORS[site.category] || 'bg-slate-600'} text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1 cursor-default`}
             >
               {site.category}
             </motion.span>
             {site.yearEstablished && (
               <motion.span 
                 whileHover={{ scale: 1.05 }}
                 className={`text-[10px] sm:text-xs ${aesthetic.styles.subText} bg-black/5 px-3 py-1.5 rounded-full border border-current/10 flex items-center gap-1.5 font-mono cursor-default`}
               >
                 <Calendar size={12} /> {site.yearEstablished}
               </motion.span>
             )}
          </div>
          
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all text-xs font-bold ${copied ? 'bg-green-500/20 text-green-400 border border-green-500/50' : `bg-black/5 ${aesthetic.styles.subText} hover:${aesthetic.styles.text} hover:bg-black/10 border border-transparent hover:border-current/30`}`}
            >
              {copied ? <><Check size={14} /> Shared</> : <><Share2 size={14} /> Share</>}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(site);
              }}
              className={`p-2 rounded-full transition-all ${isFavorite ? 'text-red-500 bg-red-500/10' : `${aesthetic.styles.subText} hover:${aesthetic.styles.text} bg-black/5 hover:bg-black/10`}`}
            >
              <Heart className={isFavorite ? "fill-current" : ""} size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content Area */}
        <motion.div variants={itemVariants} className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          <div className="md:col-span-8 space-y-6">
            <motion.h1 
              variants={itemVariants}
              className={`text-4xl sm:text-5xl md:text-6xl font-display font-black ${aesthetic.styles.text} leading-[1.1] tracking-tight`}
            >
              {site.title}
            </motion.h1>
            
            <motion.p variants={itemVariants} className={`text-lg sm:text-xl md:text-2xl ${aesthetic.styles.subText} leading-relaxed font-light max-w-2xl`}>
              {site.description}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 pt-2">
              <AnimatePresence>
                {site.tags.map(tag => (
                  <motion.button 
                    layout="position"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={tag} 
                    onClick={() => onTagClick(tag)}
                    className={`text-[11px] uppercase tracking-wider font-semibold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1 ${selectedTag === tag ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' : `${aesthetic.styles.subText} bg-black/5 border-transparent hover:border-current/30 hover:${aesthetic.styles.text}`}`}
                  >
                    <Tag size={10} /> {tag}
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Vibe Bento Box Area */}
          <motion.div variants={itemVariants} className="md:col-span-4 flex flex-col gap-4">
             {site.designVibe && (
               <div className={`p-5 ${isBrutal ? 'rounded-none border-4' : 'rounded-[2rem] glass-panel'} ${aesthetic.styles.border} relative overflow-hidden group hover:border-${aesthetic.styles.accent.replace('text-', '')}/50 transition-colors`}>
                  <div className={`absolute top-0 right-0 p-4 opacity-5 transition-transform group-hover:scale-110 group-hover:rotate-12`}>
                     <Palette size={60} className={aesthetic.styles.text} />
                  </div>
                  <div className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest ${aesthetic.styles.subText} mb-3`}>
                     <Palette size={14} className={aesthetic.styles.accent} /> Design DNA
                  </div>
                  <div className={`text-sm sm:text-base font-semibold ${aesthetic.styles.text} leading-tight relative z-10`}>{site.designVibe}</div>
               </div>
             )}
             
             {site.vibeScore !== undefined && (
               <div className={`p-5 flex-1 ${isBrutal ? 'rounded-none border-4' : 'rounded-[2rem] glass-panel'} ${aesthetic.styles.border} flex flex-col justify-center relative overflow-hidden group hover:border-${aesthetic.styles.highlight.replace('text-', '')}/50 transition-colors`}>
                  <div className={`absolute -bottom-4 -right-4 opacity-5 transition-transform group-hover:scale-110 group-hover:-rotate-12`}>
                     <Gauge size={80} className={aesthetic.styles.highlight} />
                  </div>
                  <div className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest ${aesthetic.styles.subText} mb-3 relative z-10`}>
                    <Gauge size={14} className={aesthetic.styles.highlight} /> Vibe Potency
                  </div>
                  <div className="flex items-end gap-3 relative z-10">
                    <div className={`text-5xl font-display font-black text-glow ${aesthetic.styles.text} leading-none`}>{site.vibeScore}%</div>
                  </div>
                  <div className="w-full h-2 bg-black/20 rounded-full mt-4 overflow-hidden relative z-10 shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${site.vibeScore}%` }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      className={`absolute inset-y-0 left-0 ${aesthetic.styles.highlight.replace('text-', 'bg-')} shadow-[0_0_15px_currentColor]`} 
                    />
                  </div>
               </div>
             )}
          </motion.div>
        </motion.div>

        {site.technicalStack && site.technicalStack.length > 0 && (
           <motion.div variants={itemVariants} className={`mb-8 flex items-center gap-3 overflow-x-auto custom-scrollbar pb-2 ${aesthetic.styles.subText} border-y py-4 border-current/10`}>
             <Cpu size={16} />
             <span className="text-[10px] font-bold uppercase tracking-widest shrink-0">Tech Stack:</span>
             <div className="flex gap-2 shrink-0">
               {site.technicalStack.map((tech) => (
                 <motion.span 
                   whileHover={{ scale: 1.1, y: -2 }}
                   key={tech} 
                   className={`text-[10px] font-mono px-2 py-1 rounded glass-pill border cursor-default ${aesthetic.styles.border}`}
                 >
                   {tech}
                 </motion.span>
               ))}
             </div>
           </motion.div>
        )}

        {/* Curator Note Terminal Output */}
        {site.curatorNote && (
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className={`relative overflow-hidden ${isBrutal ? 'border-2' : 'border rounded-2xl'} ${aesthetic.styles.border} glass-panel p-5 sm:p-6 mb-8`}
          >
            <div className={`absolute top-0 w-full h-1 left-0 opacity-50 ${persona.color}`}></div>
            <div className="flex gap-4 items-start relative z-10">
                <div className={`p-2 rounded-xl ${persona.color} bg-opacity-20 shrink-0 shadow-lg`}>
                  <Terminal size={24} className={persona.color.replace('bg-', 'text-')} />
                </div>
                <div className="flex-1">
                   <div className={`text-[10px] uppercase font-bold tracking-[0.2em] font-mono ${aesthetic.styles.subText} mb-2 flex items-center justify-between gap-2`}>
                       <span className="flex items-center gap-2">
                           <span className={`w-2 h-2 rounded-full ${persona.color} animate-pulse`}></span>
                           Connection from {persona.name}
                       </span>
                       
                       <button
                           onClick={handleSynthesizeNote}
                           disabled={isSynthesizing}
                           className={`p-1.5 rounded-full bg-black/20 hover:bg-black/40 border border-current/10 hover:border-current/30 transition-all ${aesthetic.styles.accent} ${isSynthesizing ? 'opacity-50 cursor-not-allowed' : ''}`}
                           title="Vocalize Note"
                       >
                           {isSynthesizing ? <Loader2 size={12} className="animate-spin" /> : isPlayingNote ? <Square size={12} className="fill-current" /> : <Volume2 size={12} />}
                       </button>
                   </div>
                   <div className={`font-mono ${aesthetic.styles.text} text-sm sm:text-base leading-relaxed`}>
                     <span className={aesthetic.styles.accent}>&gt;</span> {site.curatorNote}
                     <motion.span 
                        animate={{ opacity: [1, 0] }} 
                        transition={{ repeat: Infinity, duration: 0.8 }}
                        className={`inline-block w-2 h-4 align-middle ml-1 bg-current`}
                     />
                   </div>
                </div>
            </div>
          </motion.div>
        )}
        
        <AnimatePresence>
          {showAnalysis && (
              <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
              >
                <div className={`${isBrutal ? 'border-2 rounded-none' : 'rounded-2xl border'} ${aesthetic.styles.border} glass-panel p-6 mb-8`}>
                    <motion.div initial={{ x: -20, opacity: 0}} animate={{ x: 0, opacity: 1}} transition={{ delay: 0.2 }} className={`flex items-center gap-2 mb-4 ${aesthetic.styles.highlight} text-[10px] font-mono font-bold uppercase tracking-[0.2em]`}>
                        <BrainCircuit size={14} className="animate-pulse" /> Neural Core Extractor
                    </motion.div>
                    {isAnalyzing ? (
                        <div className={`flex flex-col items-start gap-3 ${aesthetic.styles.subText} text-sm py-4 font-mono`}>
                            <div className="flex items-center gap-3 w-full">
                                <Loader2 size={14} className="animate-spin shrink-0" /> 
                                <div className="h-[20px] overflow-hidden relative flex-1">
                                    <AnimatePresence mode="popLayout">
                                        <motion.span 
                                            key={loadingPhraseIndex}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute inset-0 whitespace-nowrap"
                                        >
                                            {ANALYSIS_PHRASES[loadingPhraseIndex]}
                                        </motion.span>
                                    </AnimatePresence>
                                </div>
                            </div>
                            <div className="w-full h-1 bg-black/20 rounded shadow-inner overflow-hidden">
                                <motion.div 
                                    animate={{ width: ["0%", "100%"] }} 
                                    transition={{ duration: 2, repeat: Infinity }} 
                                    className={`h-full ${aesthetic.styles.highlight.replace('text-', 'bg-')}`} 
                                />
                            </div>
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`text-sm sm:text-base space-y-4 ${aesthetic.styles.text} leading-relaxed font-mono whitespace-pre-wrap p-4 bg-black/20 rounded-lg shadow-inner`}>
                            <span className={`${aesthetic.styles.accent} opacity-50 select-none mr-2`}>$</span>
                            {analysisText || "Neural link severed. Analysis failed."}
                        </motion.div>
                    )}
                </div>
              </motion.div>
          )}

          {showPreview && (
              <motion.div 
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 400, opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className={`w-full mb-8 overflow-hidden ${isBrutal ? 'border-2 rounded-none' : 'rounded-2xl border'} ${aesthetic.styles.border} relative glass-panel group/iframe flex flex-col`}
              >
                 <div className={`p-2 border-b ${aesthetic.styles.border} bg-black/20 flex gap-2 items-center`}>
                     <div className="flex gap-1.5 px-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                     </div>
                     <div className={`text-[9px] font-mono tracking-widest uppercase ${aesthetic.styles.subText} ml-2`}>
                        {new URL(site.url).host}
                     </div>
                 </div>
                 
                 <div className="absolute inset-0 top-8 flex flex-col items-center justify-center p-4 text-center -z-10">
                    <Loader2 size={32} className={`animate-spin ${aesthetic.styles.accent} mb-4 opacity-30`} />
                    <span className={`text-[10px] font-mono tracking-widest ${aesthetic.styles.subText} uppercase`}>Intercepting Transmission</span>
                 </div>
                 
                 <iframe 
                    src={site.url} 
                    className="w-full flex-1 bg-white" 
                    sandbox="allow-scripts allow-same-origin"
                    title={`Preview of ${site.title}`}
                 />
              </motion.div>
          )}
        </AnimatePresence>

        {/* Field Notes Section */}
        {(isFavorite || site.fieldNote) && (
          <motion.div 
            variants={itemVariants}
            className={`mb-8 ${isBrutal ? 'border-2' : 'border rounded-2xl'} ${aesthetic.styles.border} bg-white/5 p-4 sm:p-6 transition-all relative overflow-hidden group/notes`}
          >
             <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center gap-2 text-[10px] uppercase font-bold tracking-[0.2em] ${aesthetic.styles.subText}`}>
                   <NotebookPen size={14} className={aesthetic.styles.accent} /> Field Notes
                </div>
                {!isEditingNote ? (
                  <button onClick={() => setIsEditingNote(true)} className={`text-[10px] uppercase font-bold tracking-widest ${aesthetic.styles.accent} hover:underline flex items-center gap-1`}>
                    <Pencil size={12} /> {site.fieldNote ? 'Edit Note' : 'Add Note'}
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={handleSaveNote} className="text-[10px] uppercase font-bold tracking-widest text-emerald-500 hover:underline flex items-center gap-1">
                       <Save size={12} /> Save
                    </button>
                    <button onClick={() => { setIsEditingNote(false); setNoteText(site.fieldNote || ''); }} className="text-[10px] uppercase font-bold tracking-widest text-red-500 hover:underline flex items-center gap-1">
                       <CloseIcon size={12} /> Cancel
                    </button>
                  </div>
                )}
             </div>
             
             {isEditingNote ? (
                <textarea 
                  autoFocus
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className={`w-full bg-black/40 border ${aesthetic.styles.border} rounded-lg p-3 text-sm ${aesthetic.styles.text} font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all min-h-[100px]`}
                  placeholder="Record your observations here..."
                />
             ) : site.fieldNote ? (
                <div className={`text-sm ${aesthetic.styles.text} font-mono italic opacity-90 leading-relaxed`}>
                   "{site.fieldNote}"
                </div>
             ) : (
                <div className={`text-xs ${aesthetic.styles.subText} font-mono italic opacity-50 text-center py-2`}>
                   No observations recorded yet.
                </div>
             )}
          </motion.div>
        )}

        {/* Action Bar */}
        <motion.div variants={itemVariants} className={`mt-auto pt-6 flex flex-col sm:flex-row gap-3 items-center justify-between`}>
          <div className="flex gap-2 w-full sm:w-auto">
             <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPreview(!showPreview)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 ${showPreview ? aesthetic.styles.highlight + ' bg-black/10' : aesthetic.styles.subText + ' bg-transparent hover:bg-black/5 hover:' + aesthetic.styles.text} font-bold py-3 px-5 rounded-xl transition-all text-sm border border-current/10`}
             >
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                <span className="hidden sm:inline">{showPreview ? 'Close View' : 'Quick View'}</span>
             </motion.button>
             {onFindSimilar && (
                 <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => onFindSimilar(site)}
                 className={`flex-1 sm:flex-none flex items-center justify-center gap-2 ${aesthetic.styles.subText} font-bold py-3 px-5 rounded-xl border border-current/10 hover:bg-black/5 hover:${aesthetic.styles.text} transition-all text-sm`}
                 >
                 <Sparkles size={16} />
                 <span className="hidden sm:inline">Similar</span>
                 </motion.button>
             )}
             {onAnalyze && (
                 <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleAnalyzeClick}
                     className={`flex-1 sm:flex-none flex items-center justify-center gap-2 ${showAnalysis ? aesthetic.styles.highlight + ' bg-black/10' : aesthetic.styles.accent + ' border border-current/20 hover:bg-black/5'} font-bold py-3 px-5 rounded-xl transition-all text-sm`}
                 >
                     <BrainCircuit size={16} />
                     <span className="hidden sm:inline">{showAnalysis ? 'Hide' : 'Analyze'}</span>
                 </motion.button>
             )}
             <motion.button
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 onClick={() => {
                     setShowChat(!showChat);
                     if (!showChat && chatHistory.length === 0) {
                         setChatHistory([{ role: 'model', content: `Greetings. I am ${persona.name}. What would you like to know about ${site.title}?` }]);
                     }
                 }}
                 className={`flex-1 sm:flex-none flex items-center justify-center gap-2 ${showChat ? aesthetic.styles.highlight + ' bg-black/10' : aesthetic.styles.accent + ' border border-current/20 hover:bg-black/5'} font-bold py-3 px-5 rounded-xl transition-all text-sm`}
             >
                 <Terminal size={16} />
                 <span className="hidden sm:inline">{showChat ? 'Close Chat' : 'Ask'}</span>
             </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onVisit}
            className={`w-full sm:w-auto group/btn overflow-hidden relative flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 px-8 ${isBrutal ? 'rounded-none' : 'rounded-xl'} text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl flex-1 max-w-sm`}
          >
            <div className="absolute inset-0 w-0 bg-slate-100 group-hover/btn:w-full transition-all duration-300 ease-out"></div>
            <span className="relative flex items-center gap-2">
              Launch Gateway
              <ExternalLink size={20} className="group-hover/btn:rotate-45 transition-transform duration-300" />
            </span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open(`https://web.archive.org/web/*/${site.url}`, '_blank')}
            className={`w-full sm:w-auto group/btn overflow-hidden relative flex items-center justify-center gap-3 bg-black/50 text-white font-bold py-4 px-8 border border-white/20 ${isBrutal ? 'rounded-none' : 'rounded-xl'} text-base sm:text-lg transition-all shadow-xl hover:shadow-2xl flex-1 max-w-sm`}
          >
            <div className="absolute inset-0 w-0 bg-white/10 group-hover/btn:w-full transition-all duration-300 ease-out"></div>
            <span className="relative flex items-center gap-2">
              Time Travel
              <History size={20} className="group-hover/btn:-rotate-45 transition-transform duration-300" />
            </span>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showChat && (
              <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-6"
              >
                  <div className={`p-4 rounded-xl border ${aesthetic.styles.border} bg-black/40 backdrop-blur-md flex flex-col gap-4 max-h-[400px]`}>
                      <div className="flex items-center justify-between border-b border-current/10 pb-2">
                         <div className={`text-xs font-mono font-bold flex items-center gap-2 ${aesthetic.styles.accent}`}>
                             <Terminal size={14} /> Link Established: {persona.name}
                         </div>
                      </div>
                      
                      <div ref={chatScrollRef} className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar text-sm flex flex-col">
                          {chatHistory.map((msg, idx) => (
                              <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                                  <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50 ${aesthetic.styles.subText}`}>
                                      {msg.role === 'user' ? 'You' : persona.name}
                                  </span>
                                  <div className={`p-3 rounded-xl ${msg.role === 'user' ? `${aesthetic.styles.bg} border ${aesthetic.styles.border} ${aesthetic.styles.text}` : `bg-black/60 border ${aesthetic.styles.border} ${aesthetic.styles.highlight}`}`}>
                                      <div className="markdown-body prose-sm">
                                          <Markdown>{msg.content}</Markdown>
                                      </div>
                                  </div>
                              </div>
                          ))}
                          {isChatting && (
                              <div className="self-start flex flex-col max-w-[85%] items-start">
                                 <span className={`text-[10px] uppercase font-bold tracking-widest mb-1 opacity-50 ${aesthetic.styles.subText}`}>{persona.name}</span>
                                 <div className={`p-3 rounded-xl bg-black/60 border ${aesthetic.styles.border} ${aesthetic.styles.highlight} flex items-center gap-2`}>
                                     <Loader2 size={14} className="animate-spin" /> Processing query...
                                 </div>
                              </div>
                          )}
                      </div>

                      <form onSubmit={handleChatSubmit} className="relative flex items-center mt-2">
                          <input 
                              type="text" 
                              value={chatInput}
                              onChange={e => setChatInput(e.target.value)}
                              placeholder={`Ask ${persona.name} about this site...`}
                              className={`w-full bg-black/50 border ${aesthetic.styles.border} rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-1 ${aesthetic.styles.text} placeholder:opacity-50 text-sm`}
                              disabled={isChatting}
                          />
                          <button 
                             type="submit" 
                             disabled={!chatInput.trim() || isChatting}
                             className={`absolute right-2 p-2 rounded-lg ${chatInput.trim() && !isChatting ? aesthetic.styles.text + ' bg-white/10 hover:bg-white/20' : aesthetic.styles.subText + ' opacity-50'} transition-all`}
                          >
                             <Terminal size={14} />
                          </button>
                      </form>
                  </div>
              </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={itemVariants} className={`mt-6 text-center text-[11px] ${aesthetic.styles.subText} font-mono tracking-widest flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-6 opacity-60`}>
          <motion.button whileHover={{ scale: 1.1 }} onClick={handleCopyUrl} className="flex items-center gap-1.5 hover:text-current transition-colors" title="Copy URL">
              {copiedUrl ? <CheckCheck size={12} className="text-green-500" /> : <Copy size={12} />}
              {new URL(site.url).hostname}
          </motion.button>
          <span className="hidden sm:inline-block">|</span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
             <motion.kbd whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,0,0,0.5)' }} className="px-1.5 py-0.5 rounded bg-black/10 border border-current/20 cursor-pointer">Space</motion.kbd> 
             to Stumble
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
});

SiteCard.displayName = 'SiteCard';