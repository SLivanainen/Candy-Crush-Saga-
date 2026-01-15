
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tile, CandyType, SpecialType, GRID_SIZE, COLORS } from '../types';
import { TileComponent } from './TileComponent';
import { AnimatePresence } from 'framer-motion';

interface GameBoardProps {
  level: number;
  isPaused: boolean;
  score: number;
  moves: number;
  targetScore: number;
  onScoreUpdate: (points: number) => void;
  onMoveUse: () => void;
  onLevelComplete: () => void;
  onGameOver: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  level,
  isPaused,
  score,
  moves,
  targetScore,
  onScoreUpdate,
  onMoveUse,
  onLevelComplete,
  onGameOver
}) => {
  const [board, setBoard] = useState<(Tile | null)[][]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);

  // Initialize board
  useEffect(() => {
    if (isPaused) return;
    const initialBoard: (Tile | null)[][] = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      initialBoard[r] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        // Simple avoid matching on init
        let type: CandyType;
        do {
          type = COLORS[Math.floor(Math.random() * COLORS.length)];
        } while (
          (c >= 2 && initialBoard[r][c-1]?.type === type && initialBoard[r][c-2]?.type === type) ||
          (r >= 2 && initialBoard[r-1][c]?.type === type && initialBoard[r-2][c]?.type === type)
        );
        
        initialBoard[r][c] = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          special: SpecialType.None,
          row: r,
          col: c,
        };
      }
    }
    setBoard(initialBoard);
  }, [level, isPaused]);

  // Win/Loss conditions
  useEffect(() => {
    if (isPaused) return;
    if (score >= targetScore) {
      onLevelComplete();
    } else if (moves <= 0 && !isProcessing) {
      onGameOver();
    }
  }, [score, moves, targetScore, isProcessing, isPaused]);

  const findMatches = (currentBoard: (Tile | null)[][]) => {
    const matches: Set<string> = new Set();
    
    // Horizontal
    for (let r = 0; r < GRID_SIZE; r++) {
      let streak = 1;
      for (let c = 1; c < GRID_SIZE; c++) {
        if (currentBoard[r][c] && currentBoard[r][c-1] && currentBoard[r][c].type === currentBoard[r][c-1].type) {
          streak++;
        } else {
          if (streak >= 3) {
            for (let i = 0; i < streak; i++) matches.add(`${r},${c-1-i}`);
          }
          streak = 1;
        }
      }
      if (streak >= 3) {
        for (let i = 0; i < streak; i++) matches.add(`${r},${GRID_SIZE-1-i}`);
      }
    }

    // Vertical
    for (let c = 0; c < GRID_SIZE; c++) {
      let streak = 1;
      for (let r = 1; r < GRID_SIZE; r++) {
        if (currentBoard[r][c] && currentBoard[r-1][c] && currentBoard[r][c].type === currentBoard[r-1][c].type) {
          streak++;
        } else {
          if (streak >= 3) {
            for (let i = 0; i < streak; i++) matches.add(`${r-1-i},${c}`);
          }
          streak = 1;
        }
      }
      if (streak >= 3) {
        for (let i = 0; i < streak; i++) matches.add(`${GRID_SIZE-1-i},${c}`);
      }
    }

    return Array.from(matches).map(m => {
      const [r, c] = m.split(',').map(Number);
      return { r, c };
    });
  };

  const processBoard = async (tempBoard: (Tile | null)[][], comboCount = 0) => {
    const matchCoords = findMatches(tempBoard);
    if (matchCoords.length === 0) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    const points = matchCoords.length * 20 * (comboCount + 1);
    onScoreUpdate(points);

    // 1. Mark matches as null
    const boardWithNulls = tempBoard.map(row => [...row]);
    matchCoords.forEach(({ r, c }) => {
      boardWithNulls[r][c] = null;
    });
    setBoard(boardWithNulls);

    // Small delay for visual pop
    await new Promise(resolve => setTimeout(resolve, 300));

    // 2. Collapse and Refill
    const collapsedBoard = collapseAndRefill(boardWithNulls);
    setBoard(collapsedBoard);

    await new Promise(resolve => setTimeout(resolve, 300));

    // 3. Recursive check for new matches
    processBoard(collapsedBoard, comboCount + 1);
  };

  const collapseAndRefill = (currentBoard: (Tile | null)[][]) => {
    const newBoard = currentBoard.map(row => [...row]);

    // For each column, collapse downward
    for (let c = 0; c < GRID_SIZE; c++) {
      let emptySlots = 0;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        if (newBoard[r][c] === null) {
          emptySlots++;
        } else if (emptySlots > 0) {
          const tile = newBoard[r][c]!;
          newBoard[r + emptySlots][c] = { ...tile, row: r + emptySlots };
          newBoard[r][c] = null;
        }
      }

      // Fill top slots
      for (let r = 0; r < emptySlots; r++) {
        newBoard[r][c] = {
          id: Math.random().toString(36).substr(2, 9),
          type: COLORS[Math.floor(Math.random() * COLORS.length)],
          special: SpecialType.None,
          row: r,
          col: c,
        };
      }
    }
    return newBoard;
  };

  const handleTileClick = (tile: Tile) => {
    if (isPaused || isProcessing || moves <= 0) return;

    if (!selectedTile) {
      setSelectedTile(tile);
    } else {
      const rowDiff = Math.abs(selectedTile.row - tile.row);
      const colDiff = Math.abs(selectedTile.col - tile.col);

      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        swapTiles(selectedTile, tile);
      } else {
        setSelectedTile(tile);
      }
    }
  };

  const swapTiles = async (tile1: Tile, tile2: Tile) => {
    setIsProcessing(true);
    onMoveUse();

    const tempBoard = board.map(row => [...row]);
    const t1 = { ...tile1, row: tile2.row, col: tile2.col };
    const t2 = { ...tile2, row: tile1.row, col: tile1.col };

    tempBoard[tile1.row][tile1.col] = t2;
    tempBoard[tile2.row][tile2.col] = t1;
    setBoard(tempBoard);

    await new Promise(resolve => setTimeout(resolve, 300));

    const matches = findMatches(tempBoard);
    if (matches.length > 0) {
      setSelectedTile(null);
      processBoard(tempBoard);
    } else {
      // Revert swap
      const revertBoard = board.map(row => [...row]);
      revertBoard[tile1.row][tile1.col] = tile1;
      revertBoard[tile2.row][tile2.col] = tile2;
      setBoard(revertBoard);
      setSelectedTile(null);
      setIsProcessing(false);
    }
  };

  return (
    <div 
      ref={boardRef}
      className="relative w-full h-full"
      style={{ touchAction: 'none' }}
    >
      <AnimatePresence>
        {board.flat().map((tile) => (
          tile && (
            <TileComponent 
              key={tile.id}
              tile={tile}
              isSelected={selectedTile?.id === tile.id}
              onPointerDown={() => handleTileClick(tile)}
              onPointerEnter={(e) => {
                if (e.buttons === 1 && selectedTile && selectedTile.id !== tile.id) {
                   handleTileClick(tile);
                }
              }}
              onPointerUp={() => {}}
            />
          )
        ))}
      </AnimatePresence>
    </div>
  );
};
