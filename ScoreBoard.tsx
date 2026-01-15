
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface ScoreBoardProps {
  score: number;
  moves: number;
  level: number;
  targetScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ 
  score, 
  moves, 
  level, 
  targetScore,
  soundEnabled,
  onToggleSound
}) => {
  const progress = Math.min((score / targetScore) * 100, 100);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-pink-600 font-bold text-xs uppercase tracking-widest">Level {level}</h2>
          <div className="text-3xl font-bold text-gray-800 tabular-nums">{score.toLocaleString()}</div>
        </div>
        
        <div className="flex flex-col items-end">
          <button 
            onClick={onToggleSound}
            className="p-2 mb-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
          <div className="bg-pink-500 text-white px-4 py-1 rounded-full font-bold shadow-lg">
            {moves} <span className="text-xs font-normal opacity-80">Moves</span>
          </div>
        </div>
      </div>

      <div className="w-full h-4 bg-gray-200/50 rounded-full overflow-hidden border border-white/40 shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-pink-500 to-rose-400 transition-all duration-500 rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute top-0 right-0 h-full w-4 bg-white/20 blur-[2px]" />
        </div>
      </div>
      <div className="flex justify-between text-[10px] text-gray-600 font-bold uppercase">
        <span>Goal: {targetScore.toLocaleString()}</span>
        <span>{Math.round(progress)}%</span>
      </div>
    </div>
  );
};
