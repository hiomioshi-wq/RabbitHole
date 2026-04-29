import React, { useMemo, useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Site, Aesthetic } from '../types';

interface GraphViewProps {
  history: Site[];
  aesthetic: Aesthetic;
  onNodeClick: (site: Site) => void;
}

export const GraphView: React.FC<GraphViewProps> = ({ history, aesthetic, onNodeClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  useEffect(() => {
     if (containerRef.current) {
         setDimensions({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
     }
  }, []);

  const nodes = useMemo(() => {
     const len = history.length;
     if (len === 0) return [];
     
     // Scatter slightly out from center based on index
     return history.map((site, i) => {
        const phi = i * 137.5; // Golden angle logic
        const radius = Math.sqrt(i) * 35 + 20;
        
        const cx = dimensions.width / 2 + Math.cos(phi * Math.PI / 180) * radius;
        const cy = dimensions.height / 2 + Math.sin(phi * Math.PI / 180) * radius;
        
        return {
           ...site,
           x: cx,
           y: cy
        };
     });
  }, [history, dimensions]);

  return (
    <div ref={containerRef} className={`w-full h-[60vh] border ${aesthetic.styles.border} rounded-3xl relative overflow-hidden bg-black/40 glass-panel shadow-2xl`}>
      <div className="absolute top-4 left-4 z-10 font-mono text-xs uppercase tracking-widest text-white/50 bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
        Interactive Neural Topology ({nodes.length} Nodes)
      </div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
         {nodes.map((node, i) => {
            if (i === 0) return null;
            const prev = nodes[i-1];
            const isHoveredLine = hoveredNode === node.id || hoveredNode === prev.id;
            
            return (
               <line 
                  key={`link-${node.id}`}
                  x1={prev.x} y1={prev.y}
                  x2={node.x} y2={node.y}
                  stroke={isHoveredLine ? aesthetic.styles.accent.replace('text-', '') : "rgba(255,255,255,0.15)"}
                  strokeWidth={isHoveredLine ? "3" : "1.5"}
                  className={`transition-all duration-300 ${isHoveredLine ? 'opacity-100' : ''}`}
               />
            );
         })}
      </svg>
      {nodes.map((node, i) => (
         <motion.button
            key={node.id}
            onClick={() => onNodeClick(node)}
            onHoverStart={() => setHoveredNode(node.id)}
            onHoverEnd={() => setHoveredNode(null)}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.5, zIndex: 10 }}
            className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-crosshair`}
            style={{ left: `${node.x}px`, top: `${node.y}px` }}
         >
            <div className={`w-4 h-4 rounded-full ${aesthetic.styles.bg} border-2 ${hoveredNode === node.id ? 'border-white bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]' : aesthetic.styles.border} shadow-lg shadow-white/5 transition-all`} />
            <div className={`mt-2 text-[10px] font-bold tracking-wider whitespace-nowrap bg-black/90 px-3 py-1.5 rounded-lg backdrop-blur shadow-xl ${aesthetic.styles.text} transition-all duration-300 pointer-events-none border border-white/10 ${hoveredNode === node.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
               {node.title}
            </div>
         </motion.button>
      ))}
    </div>
  );
};
