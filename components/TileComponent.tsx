
import React from 'react';
import { motion } from 'framer-motion';
import { Tile, TILE_COLORS, SpecialType } from '../types';

interface TileComponentProps {
  tile: Tile;
  isSelected: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerEnter: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
}

export const TileComponent: React.FC<TileComponentProps> = ({ 
  tile, 
  isSelected, 
  onPointerDown, 
  onPointerEnter,
  onPointerUp
}) => {
  const colorClass = TILE_COLORS[tile.type];
  
  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.1 : 1, 
        opacity: 1,
        boxShadow: isSelected ? '0 0 15px white' : 'none',
        zIndex: isSelected ? 50 : 1
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerUp={onPointerUp}
      className={`absolute w-full h-full p-1 cursor-pointer touch-none`}
      style={{
        left: `${tile.col * 12.5}%`,
        top: `${tile.row * 12.5}%`,
        width: '12.5%',
        height: '12.5%',
      }}
    >
      <div className={`w-full h-full rounded-xl ${colorClass} shadow-md border-b-4 border-black/20 relative overflow-hidden group transition-transform active:scale-90`}>
        {/* Shine effect */}
        <div className="absolute top-1 left-1 w-2/3 h-1/3 bg-white/30 rounded-full -rotate-45" />
        
        {/* Special effects icons */}
        {tile.special === SpecialType.Horizontal && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-2 bg-white/60 blur-[1px]" />
          </div>
        )}
        {tile.special === SpecialType.Vertical && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-2 bg-white/60 blur-[1px]" />
          </div>
        )}
        {tile.special === SpecialType.Bomb && (
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-3/4 h-3/4 rounded-full border-2 border-white/80 animate-ping opacity-50" />
          </div>
        )}
        {tile.special === SpecialType.ColorBomb && (
           <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-black/20 flex items-center justify-center">
             <div className="text-white font-bold text-xs">★</div>
           </div>
        )}
      </div>
    </motion.div>
  );
};
