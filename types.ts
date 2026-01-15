
export type CandyType = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export enum SpecialType {
  None = 'none',
  Horizontal = 'horizontal', // Clears row
  Vertical = 'vertical',     // Clears col
  Bomb = 'bomb',             // Clears 3x3
  ColorBomb = 'colorBomb'    // 5-match clear all of color
}

export interface Tile {
  id: string;
  type: CandyType;
  special: SpecialType;
  row: number;
  col: number;
}

export interface GameState {
  board: (Tile | null)[][];
  score: number;
  moves: number;
  level: number;
  targetScore: number;
  isGameOver: boolean;
  isLevelComplete: boolean;
  isSwapping: boolean;
  isProcessing: boolean;
}

export const GRID_SIZE = 8;
export const INITIAL_MOVES = 20;
export const COLORS: CandyType[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export const TILE_COLORS: Record<CandyType, string> = {
  red: 'bg-rose-500',
  blue: 'bg-sky-500',
  green: 'bg-emerald-500',
  yellow: 'bg-amber-400',
  purple: 'bg-violet-600',
  orange: 'bg-orange-500'
};
