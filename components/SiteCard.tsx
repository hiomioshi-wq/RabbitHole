import React, { useState } from 'react';
import { Site, Aesthetic } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { ExternalLink, Hash, Calendar, Heart, Share2, Check, Sparkles, BrainCircuit, Loader2 } from 'lucide-react';

interface SiteCardProps {
  site: Site;
  aesthetic: Aesthetic;
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
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${site.title} - ${site.url} (via RabbitHole)`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className={`absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${aesthetic.id === 'cyber' ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600' : aesthetic.id === 'vapor' ? 'bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400' : aesthetic.id === 'solar' ? 'bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400' : 'bg-gradient-to-r from-gray-600 via-gray-400 to-gray-600'}`}></div>
      
      <div className={`relative ${aesthetic.styles.cardBg} border ${aesthetic.styles.border} rounded-xl p-8 shadow-2xl overflow-hidden min-h-[400px] flex flex-col justify-between transform transition-transform duration-500 hover:scale-[1.01]`}>
        
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
                className={`p-2 rounded-full transition-all ${aesthetic.styles.subText} hover:${aesthetic.styles.text} hover:bg-black/10`}
                title="Copy link"
              >
                {copied ? <Check size={20} className="text-green-400" /> : <Share2 size={20} />}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(site);
                }}
                className={`p-2 rounded-full transition-all ${isFavorite ? 'text-red-500 bg-red-500/10' : `${aesthetic.styles.subText} hover:${aesthetic.styles.text} hover:bg-black/10`}`}
              >
                <Heart className={isFavorite ? "fill-current" : ""} size={24} />
              </button>
            </div>
          </div>

          <h1 className={`text-4xl md:text-5xl font-display font-bold ${aesthetic.styles.text} mb-6 leading-tight tracking-tight transition-all`}>
            {site.title}
          </h1>

          <p className={`text-lg md:text-xl ${aesthetic.styles.subText} leading-relaxed mb-8`}>
            {site.description}
          </p>

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
            {onFindSimilar && (
                <button
                onClick={() => onFindSimilar(site)}
                className={`flex-1 flex items-center justify-center gap-2 ${aesthetic.styles.subText} font-medium py-2 px-4 rounded-lg bg-black/20 hover:bg-black/40 hover:${aesthetic.styles.text} transition-colors text-sm`}
                >
                <Sparkles size={16} />
                Find Similar
                </button>
            )}
            
            {onAnalyze && !showAnalysis && (
                <button
                    onClick={handleAnalyzeClick}
                    className={`flex-1 flex items-center justify-center gap-2 ${aesthetic.styles.accent} font-medium py-2 px-4 rounded-lg bg-black/20 hover:bg-black/40 transition-colors text-sm`}
                >
                    <BrainCircuit size={16} />
                    Deep Analysis
                </button>
            )}
          </div>

          <div className={`text-center mt-3 text-xs ${aesthetic.styles.subText} flex justify-center items-center gap-4`}>
            <span>Opens in a new tab • {new URL(site.url).hostname}</span>
            <span className="hidden sm:inline-block opacity-50">• Press Space / ⮕ to Stumble</span>
          </div>
        </div>
      </div>
    </div>
  );
});

SiteCard.displayName = 'SiteCard';