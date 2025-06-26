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

  const loadInitialData = useCallback(async () => {
    if (isInitialized.current) return;

    try {
      console.log("🔄 Loading initial data (one-time only)");
      const [leaderboard, games] = await Promise.all([
        supabaseService.getLeaderboard(10),
        supabaseService.getRecentGames(5),
      ]);

      setPlayers(leaderboard);
      setRecentGames(games);
      isInitialized.current = true;
      console.log("✅ Initial data loaded - now realtime only!");
    } catch (error) {
      console.error("💣 Error loading initial data:", error);
      showToast("💣 Error loading data", "error");
    } finally {
      setInitializing(false);
    }
  }, [showToast]);

  const setupRealTimeSubscriptions = useCallback(() => {
    console.log("🔌 Setting up real-time subscriptions");

    const gameSubscription = supabaseService.subscribeToNewGames((newGame) => {
      console.log("🔥 New game received via real-time:", newGame);

      setRecentGames((prev) => [newGame, ...prev.slice(0, 4)]);

      if (currentPlayer && newGame.player_id !== currentPlayer.id) {
        const playerName = newGame.player?.name || "Unknown";
        const isWin = newGame.winner === "player";

        showToast(
          `🎮 ${playerName} ${isWin ? "WON" : "LOST"} ${
            newGame.player_score
          } vs ${newGame.computer_score}`,
          isWin ? "success" : "error"
        );

        playSound(isWin ? "win" : "lose");
      }
    });

    const playerSubscription = supabaseService.subscribeToPlayerUpdates(
      (updatedPlayer) => {
        console.log("📊 Player updated via real-time:", updatedPlayer);

        setPlayers((prev) => {
          const updated = prev.map((p) =>
            p.id === updatedPlayer.id ? updatedPlayer : p
          );

          return updated.sort((a, b) => {
            if (b.best_score !== a.best_score)
              return b.best_score - a.best_score;
            return b.total_points - a.total_points;
          });
        });

        if (currentPlayer && currentPlayer.id === updatedPlayer.id) {
          setCurrentPlayer(updatedPlayer);
        }
      }
    );

    subscriptionsRef.current = [gameSubscription, playerSubscription];
  }, [currentPlayer, showToast, playSound]);

  const cleanup = useCallback(() => {
    console.log("🧹 Cleaning up Supabase subscriptions");
    subscriptionsRef.current.forEach((subscription) => {
      supabaseService.unsubscribe(subscription);
    });
    subscriptionsRef.current = [];
  }, []);

  const createOrGetPlayer = async (name: string): Promise<Player> => {
    try {
      const player = await supabaseService.createOrGetPlayer(name);
      setCurrentPlayer(player);
      console.log("👤 Player set, realtime will handle updates");
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

      console.log("✅ Game saved - realtime will update UI automatically");
      showToast("💾 Game saved!", "success");

      return game;
    } catch (error) {
      console.error("💣 Error saving game:", error);
      showToast("💣 Error saving game", "error");
      return null;
    }
  };

  useEffect(() => {
    loadInitialData();
    setupRealTimeSubscriptions();

    return cleanup;
  }, [loadInitialData, setupRealTimeSubscriptions, cleanup]);

  useEffect(() => {
    if (currentPlayer) {
      cleanup();
      setupRealTimeSubscriptions();
    }
  }, [currentPlayer?.id, cleanup, setupRealTimeSubscriptions]);

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
