export interface GameResult {
  playerRolls: number[];
  opponentRolls: number[];
  playerTotal: number;
  opponentTotal: number;
  playerWins: boolean;
  survivalMessage: string;
  isEliminated: boolean;
  survivalRound: number;
}
