import type { Player, Game } from "@/services/SupabaseService";

export interface GameLeaderboardProps {
  players: Player[];
  recentGames: Game[];
  currentPlayer: Player | null;
  loading: boolean;
  onReset: () => void;
  onRefresh: () => void;
}

export type { Player, Game } from "@/services/SupabaseService";
