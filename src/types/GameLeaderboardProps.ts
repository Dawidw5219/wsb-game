import type { Player, Game } from "@/services/SupabaseService";

export interface GameLeaderboardProps {
  players: Player[];
  recentGames: Game[];
  currentPlayer: Player | null;
  initializing: boolean;
  onReset: () => void;
}

export type { Player, Game } from "@/services/SupabaseService";
