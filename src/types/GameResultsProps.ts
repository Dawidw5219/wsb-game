import type { GameResult } from "./GameResult";

export interface GameResultsProps {
  isVisible: boolean;
  gameResult: GameResult;
  playerName: string;
  onTryAgain: () => void;
}
