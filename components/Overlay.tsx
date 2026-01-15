
import React from 'react';
import { motion } from 'framer-motion';

interface OverlayProps {
  title: string;
  subtitle?: string;
  buttonText: string;
  onAction: () => void;
  variant: 'start' | 'success' | 'danger';
}

export const Overlay: React.FC<OverlayProps> = ({ title, subtitle, buttonText, onAction, variant }) => {
  const bgColors = {
    start: 'bg-indigo-500/90',
    success: 'bg-emerald-500/90',
    danger: 'bg-rose-500/90'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 z-[100] flex flex-col items-center justify-center p-8 text-center rounded-2xl backdrop-blur-sm ${bgColors[variant]}`}
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="text-white"
      >
        <h1 className="text-4xl font-black mb-2 drop-shadow-lg uppercase tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xl font-medium mb-8 text-white/90 drop-shadow">{subtitle}</p>}
        
        <button
          onClick={onAction}
          className="group relative inline-flex items-center justify-center px-10 py-4 font-bold text-lg bg-white text-indigo-600 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          {buttonText}
          <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-20 pointer-events-none" />
        </button>
      </motion.div>
      
      {variant === 'start' && (
        <div className="absolute bottom-8 text-white/60 text-xs font-bold uppercase tracking-widest">
          Match 3 to Clear • Match 4 for Powerups
        </div>
      )}
    </motion.div>
  );
};
