import React, { useState } from 'react';
import { Site, Aesthetic, CuratorPersona, TimeEra } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { ExternalLink, Hash, Calendar, Heart, Share2, Check, Sparkles, BrainCircuit, Loader2, Gauge, Cpu, Palette, Eye, EyeOff, Copy, CheckCheck } from 'lucide-react';

interface SiteCardProps {
  site: Site;
  aesthetic: Aesthetic;
  persona: CuratorPersona;
  era: TimeEra;
  isFavorite: boolean;
  onToggleFavorite: (site: Site) => void;
  onVisit: () => void;
  onTagClick: (tag: string) => void;
  onFindSimilar?: (site: Site) => void;
  onAnalyze?: (site: Site) => void;
  selectedTag: string | null;
  analysisText?: string | null;
  isAnalyzing?: boolean;
}

export const SiteCard: React.FC<SiteCardProps> = React.memo(({ 
  site, 
  aesthetic,
  persona,
  era,
  isFavorite, 
  onToggleFavorite, 
  onVisit,
  onTagClick,
  onFindSimilar,
  onAnalyze,
  selectedTag,
  analysisText,
  isAnalyzing
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `🕳️ Down the RabbitHole 🕳️\n\nI discovered: ${site.title}\n"${site.description}"\n\n🎨 Vibe: ${aesthetic.name}\n🕰️ Era: ${era.name}\n🤖 Curator: ${persona.name}\n\nExplore it here: ${site.url}`;
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(site.url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleAnalyzeClick = () => {
      setShowAnalysis(true);
      if (onAnalyze && !analysisText) {
          onAnalyze(site);
      }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto group perspective-1000">
      {/* Background Glow Effect - Dynamic based on Aesthetic */}
      <div className={`absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${
        aesthetic.id === 'cyber' ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600' : 
        aesthetic.id === 'vapor' ? 'bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400' : 
        aesthetic.id === 'solar' ? 'bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400' : 
        aesthetic.id === 'matrix' ? 'bg-gradient-to-r from-green-900 via-green-400 to-green-900' :
        aesthetic.id === 'academic' ? 'bg-gradient-to-r from-amber-700 via-amber-200 to-amber-900' :
        'bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600'
      }`}></div>
      
      <div className={`relative ${aesthetic.styles.cardBg} border ${aesthetic.styles.border} rounded-xl p-8 shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-between transform transition-all duration-700 ease-out hover:scale-[1.02] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-float`}>
        
        {/* Background Pattern */}
        <div className={`absolute top-0 right-0 p-12 opacity-5 pointer-events-none ${aesthetic.styles.text}`}>
          <Hash size={200} />
        </div>

        <div>
          <div className="flex justify-between items-start mb-6">
            <span className={`${CATEGORY_COLORS[site.category] || 'bg-slate-600'} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
              {site.category}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleShare}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-xs font-bold ${copied ? 'bg-green-500/20 text-green-400 border border-green-500/50' : `bg-black/20 ${aesthetic.styles.subText} hover:${aesthetic.styles.text} hover:bg-black/40 border border-transparent hover:border-current`}`}
                title="Share Discovery Summary"
              >
                {copied ? <><Check size={14} /> Copied Summary!</> : <><Share2 size={14} /> Share</>}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(site);
                }}
                className={`p-2 rounded-full transition-all ${isFavorite ? 'text-red-500 bg-red-500/10' : `${aesthetic.styles.subText} hover:${aesthetic.styles.text} hover:bg-black/10`}`}
              >
                <Heart className={isFavorite ? "fill-current" : ""} size={20} />
              </button>
            </div>
          </div>

          <h1 className={`text-4xl md:text-5xl font-display font-bold ${aesthetic.styles.text} mb-6 leading-tight tracking-tight transition-all`}>
            {site.title}
          </h1>

          <p className={`text-lg md:text-xl ${aesthetic.styles.subText} leading-relaxed mb-8`}>
            {site.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {site.designVibe && (
              <div className={`flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5`}>
                 <Palette size={18} className={aesthetic.styles.accent} />
                 <div>
                   <div className={`text-[10px] uppercase font-bold tracking-widest ${aesthetic.styles.subText} mb-0.5`}>Design DNA</div>
                   <div className={`text-sm font-medium ${aesthetic.styles.text}`}>{site.designVibe}</div>
                 </div>
              </div>
            )}
            
            {site.vibeScore !== undefined && (
              <div className={`flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5`}>
                 <Gauge size={18} className={aesthetic.styles.highlight} />
                 <div className="flex-1">
                   <div className={`text-[10px] uppercase font-bold tracking-widest ${aesthetic.styles.subText} mb-0.5`}>Vibe Potency</div>
                   <div className="flex items-center gap-2">
                     <div className={`text-sm font-bold ${aesthetic.styles.text}`}>{site.vibeScore}%</div>
                     <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className={`h-full ${aesthetic.styles.highlight === 'text-cyan-400' || aesthetic.styles.highlight === 'text-cyan-500' ? 'bg-cyan-500' : 'bg-indigo-500'} transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.3)]`} 
                         style={{ width: `${site.vibeScore}%` }}
                       />
                     </div>
                   </div>
                 </div>
              </div>
            )}
          </div>

          {site.technicalStack && site.technicalStack.length > 0 && (
             <div className="mb-6 flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
               <Cpu size={14} className={aesthetic.styles.subText} />
               <div className="flex gap-2">
                 {site.technicalStack.map(tech => (
                   <span key={tech} className={`text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border ${aesthetic.styles.border} ${aesthetic.styles.subText}`}>
                     {tech}
                   </span>
                 ))}
               </div>
             </div>
          )}

          {site.curatorNote && (
            <div className={`bg-black/20 border-l-4 ${aesthetic.id === 'brutal' ? 'border-lime-500' : 'border-indigo-500'} p-4 mb-6 rounded-r-lg italic ${aesthetic.styles.subText} text-sm`}>
              "<span className={`${aesthetic.styles.highlight} font-semibold`}>AI Curator:</span> {site.curatorNote}"
            </div>
          )}
          
          {/* Analysis Section */}
          {showAnalysis && (
              <div className={`bg-black/30 border ${aesthetic.styles.border} rounded-lg p-4 mb-6 animate-fade-in relative overflow-hidden`}>
                  <div className={`flex items-center gap-2 mb-2 ${aesthetic.styles.highlight} text-sm font-bold uppercase tracking-wider`}>
                      <BrainCircuit size={16} /> Neural Analysis
                  </div>
                  {isAnalyzing ? (
                      <div className={`flex items-center gap-3 ${aesthetic.styles.subText} text-sm py-4`}>
                          <Loader2 size={16} className="animate-spin" /> Analyzing site patterns...
                      </div>
                  ) : (
                      <p className={`text-sm ${aesthetic.styles.text} leading-relaxed font-mono`}>
                          {analysisText || "Analysis unavailable."}
                      </p>
                  )}
              </div>
          )}

          {/* Iframe Quick View Extension */}
          {showPreview && (
              <div className={`w-full h-64 md:h-80 mb-6 rounded-lg overflow-hidden border ${aesthetic.styles.border} animate-fade-in relative bg-black/50 group/iframe`}>
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center opacity-50">
                    <Loader2 size={32} className={`animate-spin ${aesthetic.styles.accent} mb-4`} />
                    <p className={`text-sm ${aesthetic.styles.subText}`}>Establishing neural link...</p>
                 </div>
                 <iframe 
                    src={site.url} 
                    className="w-full h-full relative z-10 bg-white" 
                    sandbox="allow-scripts allow-same-origin"
                    title={`Preview of ${site.title}`}
                 />
                 <div className="absolute inset-0 z-20 pointer-events-none border-b-2 border-transparent group-hover/iframe:border-cyan-400 transition-colors"></div>
              </div>
          )}

          <div className="flex flex-wrap gap-2 mb-8">
            {site.tags.map(tag => (
              <button 
                key={tag} 
                onClick={() => onTagClick(tag)}
                className={`text-xs px-2 py-1 rounded border transition-all ${selectedTag === tag ? 'bg-indigo-600 border-indigo-500 text-white' : `${aesthetic.styles.subText} bg-black/20 border-transparent hover:border-current hover:${aesthetic.styles.text}`}`}
              >
                #{tag}
              </button>
            ))}
            {site.yearEstablished && (
               <span className={`text-xs ${aesthetic.styles.subText} bg-black/20 px-2 py-1 rounded border border-transparent flex items-center gap-1 cursor-default`}>
                <Calendar size={12} /> {site.yearEstablished}
              </span>
            )}
          </div>
        </div>

        <div className={`mt-auto pt-6 border-t ${aesthetic.styles.border} space-y-3`}>
          <button
            onClick={onVisit}
            className={`w-full group/btn relative flex items-center justify-center gap-3 bg-white text-slate-900 font-bold py-4 px-6 rounded-lg text-lg hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 shadow-lg`}
          >
            Launch Website
            <ExternalLink size={20} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex gap-2">
            <button
               onClick={() => setShowPreview(!showPreview)}
               className={`flex-1 flex items-center justify-center gap-2 ${showPreview ? aesthetic.styles.highlight + ' bg-black/40' : aesthetic.styles.subText + ' bg-black/20 hover:bg-black/40 hover:' + aesthetic.styles.text} font-medium py-2 px-4 rounded-lg transition-colors text-sm`}
            >
               {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
               {showPreview ? 'Close View' : 'Quick View'}
            </button>
            {onFindSimilar && (
                <button
                onClick={() => onFindSimilar(site)}
                className={`flex-1 flex items-center justify-center gap-2 ${aesthetic.styles.subText} font-medium py-2 px-4 rounded-lg bg-black/20 hover:bg-black/40 hover:${aesthetic.styles.text} transition-colors text-sm`}
                >
                <Sparkles size={16} />
                Similar
                </button>
            )}
            
            {onAnalyze && !showAnalysis && (
                <button
                    onClick={handleAnalyzeClick}
                    className={`flex-1 flex items-center justify-center gap-2 ${aesthetic.styles.accent} font-medium py-2 px-4 rounded-lg bg-black/20 hover:bg-black/40 transition-colors text-sm cursor-help`}
                    title="Let the AI curator perform a deep neural analysis of this site's purpose and design."
                >
                    <BrainCircuit size={16} />
                    Analyze
                </button>
            )}
          </div>

          <div className={`text-center mt-3 text-xs ${aesthetic.styles.subText} flex justify-center items-center gap-4`}>
            <span className="flex items-center gap-1">
                Opens in a new tab • {new URL(site.url).hostname} 
                <button onClick={handleCopyUrl} className="ml-1 p-1 hover:text-white transition-colors" title="Copy URL">
                    {copiedUrl ? <CheckCheck size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
            </span>
            <span className="hidden sm:inline-block opacity-50">• Press Space / ⮕ to Stumble</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SiteCard.displayName = 'SiteCard';