import { useState, useEffect, useRef, useCallback } from "react";
import {
  supabaseService,
  type Player,
  type Game,
} from "@/services/SupabaseService";
import { useToast } from "@/hooks/useToast";
import { useSound } from "@/hooks/useSound";
import type { RealtimeChannel } from "@supabase/supabase-js";

export const useSupabase = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [recentGames, setRecentGames] = useState<Game[]>([]);
  const [initializing, setInitializing] = useState(true);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const subscriptionsRef = useRef<RealtimeChannel[]>([]);
  const isInitialized = useRef(false);
  const { showToast } = useToast();
  const { playSound } = useSound();

  const setupRealTimeSubscriptions = useCallback(() => {
    const gameSubscription = supabaseService.subscribeToNewGames((newGame) => {
      setRecentGames((prev) => [newGame, ...prev.slice(0, 4)]);

      const playerName = newGame.player?.name || "Unknown";
      const isWin = newGame.winner === "player";

      showToast(
        `🎮 ${playerName} ${isWin ? "WON" : "LOST"} ${
          newGame.player_score
        } vs ${newGame.computer_score}`,
        isWin ? "success" : "error"
      );

      playSound(isWin ? "win" : "lose");
    });

    const playerSubscription = supabaseService.subscribeToPlayerUpdates(
      (updatedPlayer) => {
        setPlayers((prev) => {
          const updated = prev.map((p) =>
            p.id === updatedPlayer.id ? updatedPlayer : p
          );

          const sorted = updated.sort((a, b) => {
            if (b.best_score !== a.best_score)
              return b.best_score - a.best_score;
            return b.total_points - a.total_points;
          });

          return sorted;
        });

        setCurrentPlayer((prev) => {
          if (prev && prev.id === updatedPlayer.id) {
            return updatedPlayer;
          }
          return prev;
        });
      }
    );

    subscriptionsRef.current = [gameSubscription, playerSubscription];
  }, [showToast, playSound]);

  const cleanup = useCallback(() => {
    subscriptionsRef.current.forEach((subscription) => {
      supabaseService.unsubscribe(subscription);
    });
    subscriptionsRef.current = [];
  }, []);

  const createOrGetPlayer = async (name: string): Promise<Player> => {
    try {
      const player = await supabaseService.createOrGetPlayer(name);
      setCurrentPlayer(player);

      // Ensure player is in leaderboard (for new players or if not loaded yet)
      setPlayers((prev) => {
        const existingIndex = prev.findIndex((p) => p.id === player.id);
        if (existingIndex >= 0) {
          // Update existing player
          const updated = [...prev];
          updated[existingIndex] = player;
          return updated.sort((a, b) => {
            if (b.best_score !== a.best_score)
              return b.best_score - a.best_score;
            return b.total_points - a.total_points;
          });
        } else {
          // Add new player and sort
          const newList = [...prev, player];
          return newList.sort((a, b) => {
            if (b.best_score !== a.best_score)
              return b.best_score - a.best_score;
            return b.total_points - a.total_points;
          });
        }
      });

      return player;
    } catch (error) {
      console.error("💣 Error creating/getting player:", error);
      showToast("💣 Error creating player", "error");
      throw error;
    }
  };

  const saveGame = async (
    playerRolls: number[],
    computerRolls: number[],
    playerWins: boolean
  ): Promise<Game | null> => {
    if (!currentPlayer) {
      console.error("💣 No current player set");
      showToast("💣 No player selected", "error");
      return null;
    }

    try {
      const game = await supabaseService.saveGame(
        currentPlayer.id,
        playerRolls,
        computerRolls,
        playerWins
      );

      showToast("💾 Game saved!", "success");

      return game;
    } catch (error) {
      console.error("💣 Error saving game:", error);
      showToast("💣 Error saving game", "error");
      return null;
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      if (isInitialized.current) return;

      try {
        const [leaderboard, games] = await Promise.all([
          supabaseService.getLeaderboard(10),
          supabaseService.getRecentGames(5),
        ]);

        setPlayers(leaderboard);
        setRecentGames(games);
        isInitialized.current = true;
      } catch (error) {
        console.error("💣 Error loading initial data:", error);
        showToast("💣 Error loading data", "error");
      } finally {
        setInitializing(false);
      }
    };

    initializeApp();
    setupRealTimeSubscriptions();

    return cleanup;
  }, []); // COMPLETELY EMPTY - no dependencies!

  return {
    players,
    recentGames,
    initializing,
    currentPlayer,
    createOrGetPlayer,
    saveGame,
    cleanup,
  };
};
