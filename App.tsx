
import React, { useState, useEffect, useCallback } from 'react';
import { GameBoard } from './components/GameBoard';
import { Overlay } from './components/Overlay';
import { ScoreBoard } from './components/ScoreBoard';
import { Tile, CandyType, SpecialType, GRID_SIZE, INITIAL_MOVES, COLORS } from './types';
import { motion, AnimatePresence } from 'framer-motion';

const generateRandomTile = (row: number, col: number): Tile => ({
  id: Math.random().toString(36).substr(2, 9),
  type: COLORS[Math.floor(Math.random() * COLORS.length)],
  special: SpecialType.None,
  row,
  col,
});

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover' | 'complete'>('start');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(INITIAL_MOVES);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const startGame = () => {
    setScore(0);
    setMoves(INITIAL_MOVES + (level - 1) * 2);
    setGameState('playing');
  };

  const handleLevelComplete = () => {
    setGameState('complete');
  };

  const handleGameOver = () => {
    setGameState('gameover');
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setScore(0);
    setMoves(INITIAL_MOVES + level * 2);
    setGameState('playing');
  };

  const restartGame = () => {
    setLevel(1);
    setScore(0);
    setMoves(INITIAL_MOVES);
    setGameState('playing');
  };

  const targetScore = level * 1500;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 select-none touch-none bg-gradient-to-b from-pink-300 via-purple-300 to-indigo-400 overflow-hidden">
      <div className="max-w-md w-full relative bg-white/30 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/40">
        
        {/* Header UI */}
        <div className="flex justify-between items-center mb-6">
          <ScoreBoard 
            score={score} 
            moves={moves} 
            level={level} 
            targetScore={targetScore}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
          />
        </div>

        {/* The Game Board */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white/20 p-2 shadow-inner">
          <GameBoard 
            level={level}
            isPaused={gameState !== 'playing'}
            onScoreUpdate={(s) => setScore(prev => prev + s)}
            onMoveUse={() => setMoves(prev => {
              if (prev <= 1) {
                // We'll check game over in the game loop usually, but here is fine too
                return 0;
              }
              return prev - 1;
            })}
            moves={moves}
            score={score}
            targetScore={targetScore}
            onLevelComplete={handleLevelComplete}
            onGameOver={handleGameOver}
          />
        </div>

        {/* Screen Overlays */}
        <AnimatePresence>
          {gameState === 'start' && (
            <Overlay 
              title="Sweet Adventure" 
              buttonText="Play Game" 
              onAction={startGame}
              variant="start"
            />
          )}
          {gameState === 'complete' && (
            <Overlay 
              title="Level Complete!" 
              subtitle={`You reached level ${level}!`}
              buttonText="Next Level" 
              onAction={nextLevel}
              variant="success"
            />
          )}
          {gameState === 'gameover' && (
            <Overlay 
              title="Game Over" 
              subtitle={`Final Score: ${score}`}
              buttonText="Try Again" 
              onAction={restartGame}
              variant="danger"
            />
          )}
        </AnimatePresence>
      </div>

      <p className="mt-4 text-white/80 font-medium text-sm">Swap candies to match 3 or more!</p>
    </div>
  );
};

export default App;
