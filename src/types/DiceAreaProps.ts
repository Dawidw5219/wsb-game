type GamePhase =
  | "PLAYER_TURN"
  | "PLAYER_ROLLING"
  | "COMPUTER_ROLLING"
  | "GAME_ENDED";

export interface DiceAreaProps {
  playerRolls: number[];
  opponentRolls: number[];
  gamePhase: GamePhase;
  isComputerRolling: boolean;
  currentComputerRoll: number | null;
  diceCallbackEnabled: boolean;
  onRoll: () => void;
  onDiceRollComplete?: (value: number) => void;
}
