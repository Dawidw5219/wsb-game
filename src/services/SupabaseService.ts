import { createClient, type RealtimeChannel } from "@supabase/supabase-js";

export interface Player {
  id: string;
  name: string;
  total_games: number;
  total_points: number;
  best_score: number;
  created_at: string;
  updated_at: string;
}

export interface Game {
  id: string;
  player_id: string;
  player_score: number;
  computer_score: number;
  player_rolls: number[];
  computer_rolls: number[];
  status: "in_progress" | "completed";
  winner: "player" | "computer" | "tie";
  created_at: string;
  completed_at?: string;
  player?: Player;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("🔥 KURWA! Missing Supabase env variables!");
}

export const supabase = createClient(supabaseUrl, supabaseKey);

class SupabaseService {
  async createOrGetPlayer(name: string): Promise<Player> {
    console.log("🔍 Creating or getting player:", name);

    const { data: existingPlayer, error: fetchError } = await supabase
      .from("players")
      .select("*")
      .eq("name", name)
      .single();

    if (existingPlayer && !fetchError) {
      console.log("✅ Found existing player:", existingPlayer);
      return existingPlayer;
    }

    const { data: newPlayer, error: createError } = await supabase
      .from("players")
      .insert([
        {
          name,
          total_games: 0,
          total_points: 0,
          best_score: 0,
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error("💣 Error creating player:", createError);
      throw createError;
    }

    console.log("🎉 Created new player:", newPlayer);
    return newPlayer!;
  }

  async saveGame(
    playerId: string,
    playerRolls: number[],
    computerRolls: number[],
    playerWins: boolean
  ): Promise<Game> {
    console.log("💾 Saving game:", {
      playerId,
      playerRolls,
      computerRolls,
      playerWins,
    });

    const playerScore = playerRolls.reduce((a, b) => a + b, 0);
    const computerScore = computerRolls.reduce((a, b) => a + b, 0);
    const winner =
      playerScore > computerScore
        ? "player"
        : computerScore > playerScore
        ? "computer"
        : "tie";

    const { data: game, error: gameError } = await supabase
      .from("games")
      .insert([
        {
          player_id: playerId,
          player_score: playerScore,
          computer_score: computerScore,
          player_rolls: playerRolls,
          computer_rolls: computerRolls,
          status: "completed",
          winner,
          completed_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (gameError) {
      console.error("💣 Error saving game:", gameError);
      throw gameError;
    }

    await this.updatePlayerStats(playerId, playerScore, playerWins);

    console.log("🎉 Game saved successfully:", game);
    return game!;
  }

  async updatePlayerStats(
    playerId: string,
    score: number,
    won: boolean
  ): Promise<void> {
    console.log("📊 Updating player stats:", { playerId, score, won });

    const { data: player, error: fetchError } = await supabase
      .from("players")
      .select("*")
      .eq("id", playerId)
      .single();

    if (fetchError || !player) {
      console.error("💣 Error fetching player for stats update:", fetchError);
      return;
    }

    const newTotalGames = player.total_games + 1;
    const newTotalPoints = player.total_points + score;
    const newBestScore = Math.max(player.best_score, score);

    const { error: updateError } = await supabase
      .from("players")
      .update({
        total_games: newTotalGames,
        total_points: newTotalPoints,
        best_score: newBestScore,
        updated_at: new Date().toISOString(),
      })
      .eq("id", playerId);

    if (updateError) {
      console.error("💣 Error updating player stats:", updateError);
      throw updateError;
    }

    console.log("✅ Player stats updated successfully");
  }

  async getLeaderboard(limit: number = 10): Promise<Player[]> {
    console.log("🏆 Fetching leaderboard, limit:", limit);

    const { data: players, error } = await supabase
      .from("players")
      .select("*")
      .order("best_score", { ascending: false })
      .order("total_points", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("💣 Error fetching leaderboard:", error);
      throw error;
    }

    console.log("✅ Leaderboard fetched:", players?.length, "players");
    return players || [];
  }

  async getRecentGames(limit: number = 5): Promise<Game[]> {
    console.log("🎮 Fetching recent games, limit:", limit);

    const { data: games, error } = await supabase
      .from("games")
      .select(
        `
        *,
        player:players(*)
      `
      )
      .eq("status", "completed")
      .order("completed_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("💣 Error fetching recent games:", error);
      throw error;
    }

    console.log("✅ Recent games fetched:", games?.length, "games");
    return games || [];
  }

  subscribeToNewGames(onNewGame: (game: Game) => void) {
    console.log("👂 Subscribing to new games");

    const subscription = supabase
      .channel("public:games")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "games",
          filter: "status=eq.completed",
        },
        async (payload) => {
          console.log("🔥 New game completed!", payload);

          const { data: gameWithPlayer } = await supabase
            .from("games")
            .select(
              `
              *,
              player:players(*)
            `
            )
            .eq("id", payload.new.id)
            .single();

          if (gameWithPlayer) {
            onNewGame(gameWithPlayer);
          }
        }
      )
      .subscribe();

    return subscription;
  }

  subscribeToPlayerUpdates(onPlayerUpdate: (player: Player) => void) {
    console.log("👂 Subscribing to player updates");

    const subscription = supabase
      .channel("public:players")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "players",
        },
        (payload) => {
          console.log("📊 Player updated!", payload);
          onPlayerUpdate(payload.new as Player);
        }
      )
      .subscribe();

    return subscription;
  }

  unsubscribe(subscription: RealtimeChannel) {
    console.log("🔌 Unsubscribing from real-time updates");
    supabase.removeChannel(subscription);
  }
}

export const supabaseService = new SupabaseService();
export default supabaseService;
