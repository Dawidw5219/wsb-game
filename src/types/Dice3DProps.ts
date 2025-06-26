export interface Dice3DProps {
  value?: number;
  isRolling?: boolean;
  onRollComplete?: (value: number) => void;
  glowColor?: "cyan" | "red" | "green";
  canClick?: boolean;
  autoRoll?: boolean;
}
