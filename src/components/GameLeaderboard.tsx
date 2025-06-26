import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/useSound";
import type { GameLeaderboardProps } from "@/types";

export const GameLeaderboard = ({
  players,
  recentGames,
  currentPlayer,
  initializing,
  onReset,
}: GameLeaderboardProps) => {
  const { playSound } = useSound();

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="bg-black/80 border-2 border-cyan-400 p-4 sm:p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.2)]">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-cyan-400 text-center font-mono">
            🏆 GLOBAL LEADERBOARD
          </h2>
        </div>

        {initializing ? (
          <div className="text-center text-cyan-400 font-mono py-6 sm:py-8">
            <div className="animate-spin text-xl sm:text-2xl mb-2">⟳</div>
            INITIALIZING...
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
            {players.length === 0 ? (
              <div className="text-center text-gray-400 font-mono py-4">
                No players yet. Be the first! 🎯
              </div>
            ) : (
              players.map((player, idx) => {
                const isCurrentPlayer =
                  currentPlayer && player.id === currentPlayer.id;

                return (
                  <div
                    key={player.id}
                    className={`p-2 sm:p-3 rounded border font-mono text-xs sm:text-sm transition-all duration-300 ${
                      isCurrentPlayer
                        ? "bg-cyan-900/50 border-cyan-400 text-cyan-300 font-bold shadow-[0_0_15px_rgba(0,255,255,0.3)]"
                        : "bg-gray-900/30 border-gray-600 text-gray-300 hover:bg-gray-800/40"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center gap-1 sm:gap-2">
                        <span className="text-xs w-4 sm:w-6">#{idx + 1}</span>
                        <span className="truncate max-w-[80px] sm:max-w-[120px]">
                          {player.name}
                        </span>
                        {isCurrentPlayer && (
                          <span className="text-cyan-400 animate-pulse">
                            👤
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs opacity-80">
                      <span>🎯 Best: {player.best_score}</span>
                      <span>🎮 Games: {player.total_games}</span>
                    </div>
                    <div className="text-xs opacity-60 mt-1">
                      📊 Total: {player.total_points}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Card>

      <Card className="bg-black/80 border-2 border-red-400 p-4 sm:p-6 backdrop-blur-sm shadow-[0_0_30px_rgba(255,0,0,0.2)]">
        <div className="flex justify-between items-center mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-bold text-red-400 font-mono">
            🔥 RECENT BATTLES
          </h3>
        </div>

        {initializing ? (
          <div className="text-center text-red-400 font-mono py-4">
            <div className="animate-spin text-lg sm:text-xl mb-2">⟳</div>
            INITIALIZING...
          </div>
        ) : (
          <div className="space-y-2 max-h-[200px] sm:max-h-[300px] overflow-y-auto">
            {recentGames.length === 0 ? (
              <div className="text-center text-gray-400 font-mono py-4 text-xs sm:text-sm">
                No recent games 🎲
              </div>
            ) : (
              recentGames.map((game) => {
                const isWin = game.winner === "player";
                const playerName = game.player?.name || "Unknown";
                const isOwnGame =
                  currentPlayer && game.player_id === currentPlayer.id;

                return (
                  <div
                    key={game.id}
                    className={`p-2 rounded border font-mono text-xs transition-all duration-300 ${
                      isOwnGame
                        ? "bg-cyan-900/30 border-cyan-500/50 text-cyan-300"
                        : "bg-gray-900/20 border-gray-700 text-gray-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span
                          className={isWin ? "text-green-400" : "text-red-400"}
                        >
                          {isWin ? "🏆" : "💀"}
                        </span>
                        <span className="truncate max-w-[60px] sm:max-w-[80px]">
                          {playerName}
                        </span>
                        {isOwnGame && <span className="text-cyan-400">👤</span>}
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span
                          className={`font-bold text-xs ${
                            isWin ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {game.player_score} vs {game.computer_score}
                        </span>
                        <span className="text-gray-500 text-[10px]">
                          {formatTimeAgo(game.completed_at || game.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </Card>

      <Button
        onClick={() => {
          playSound("click");
          onReset();
        }}
        onMouseEnter={() => playSound("hover")}
        className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 font-mono text-base sm:text-lg py-2 sm:py-3 cursor-pointer transition-all duration-300 hover:shadow-[0_0_15px_rgba(128,128,128,0.3)]"
      >
        🔄 RESTART PROTOCOL
      </Button>
    </div>
  );
};
