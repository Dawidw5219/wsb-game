import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Dice3D from "@/components/Dice3D";
import { useSound } from "@/hooks/useSound";
import type { GameResultsProps } from "@/types";

export const GameResults = ({
  isVisible,
  gameResult,
  playerName,
  onTryAgain,
}: GameResultsProps) => {
  const { playSound } = useSound();

  if (!isVisible) return null;

  return (
    <Card className="bg-black/80 border-2 border-cyan-400 p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.2)]">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center font-mono">
        ⚔️ COMBAT RESULTS ⚔️
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-mono text-cyan-300">
            {playerName.toUpperCase()}:
          </h3>
          <div className="flex justify-center flex-wrap gap-3">
            {gameResult.playerRolls.map((roll, idx) => (
              <Dice3D
                key={idx}
                value={roll}
                isRolling={false}
                glowColor={gameResult.playerWins ? "green" : "red"}
              />
            ))}
          </div>
          <div className="text-3xl font-bold text-cyan-400 font-mono">
            TOTAL: {gameResult.playerTotal}
          </div>
        </div>

        <div className="text-center space-y-4">
          <h3 className="text-xl font-mono text-red-300">PROTOCOL:</h3>
          <div className="flex justify-center flex-wrap gap-3">
            {gameResult.opponentRolls.map((roll, idx) => (
              <Dice3D
                key={idx}
                value={roll}
                isRolling={false}
                glowColor={gameResult.playerWins ? "red" : "green"}
              />
            ))}
          </div>
          <div className="text-3xl font-bold text-red-400 font-mono">
            TOTAL: {gameResult.opponentTotal}
          </div>
        </div>
      </div>

      <div className="text-center mt-8 space-y-4">
        <div
          className={`text-4xl font-bold font-mono ${
            gameResult.playerWins ? "text-green-400" : "text-red-400"
          }`}
        >
          {gameResult.playerWins ? "🏆 VICTORY" : "💀 DEFEAT"}
        </div>

        <Button
          onClick={onTryAgain}
          onMouseEnter={() => playSound("hover")}
          className={`font-mono text-xl py-4 px-8 border-0 cursor-pointer ${
            gameResult.playerWins
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-[0_0_20px_rgba(0,255,0,0.5)]"
              : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-[0_0_20px_rgba(255,0,0,0.5)]"
          }`}
        >
          {gameResult.playerWins ? "🔥 TRY AGAIN" : "💀 TRY AGAIN"}
        </Button>
      </div>
    </Card>
  );
};
