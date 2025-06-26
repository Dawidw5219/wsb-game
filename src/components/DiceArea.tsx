import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Dice3D from "@/components/Dice3D";
import { useSound } from "@/hooks/useSound";
import type { DiceAreaProps } from "@/types";

export const DiceArea = ({
  playerRolls,
  opponentRolls,
  gamePhase,
  isComputerRolling,
  currentComputerRoll,
  diceCallbackEnabled,
  onRoll,
  onDiceRollComplete,
}: DiceAreaProps) => {
  const { playSound } = useSound();

  const isRolling = gamePhase === "PLAYER_ROLLING";

  return (
    <Card className="bg-black/80 border-2 border-cyan-400 p-8 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.2)] min-h-[800px]">
      <div className="text-center space-y-8">
        <h2 className="text-2xl font-bold font-mono">
          {gamePhase === "PLAYER_TURN" && (
            <span className="text-cyan-400">
              🎲 YOUR TURN - DICE {playerRolls.length + 1} OF 5
            </span>
          )}
          {gamePhase === "PLAYER_ROLLING" && (
            <span className="text-cyan-400">
              🎲 ROLLING YOUR DICE {playerRolls.length + 1} OF 5
            </span>
          )}
          {gamePhase === "COMPUTER_ROLLING" && (
            <span className="text-red-400">
              🤖 PROTOCOL ROLLING - DICE {opponentRolls.length + 1} OF 5
            </span>
          )}
        </h2>

        <div className="grid grid-cols-2 gap-8 text-lg font-mono">
          <div className="text-cyan-300">
            <div className="font-bold">YOUR DICE: {playerRolls.length}/5</div>
            {playerRolls.length > 0 && (
              <div className="text-cyan-400">
                TOTAL: {playerRolls.reduce((a, b) => a + b, 0)}
              </div>
            )}
          </div>
          <div className="text-red-300">
            <div className="font-bold">PROTOCOL: {opponentRolls.length}/5</div>
            {opponentRolls.length > 0 && (
              <div className="text-red-400">
                TOTAL: {opponentRolls.reduce((a, b) => a + b, 0)}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-mono text-cyan-300">YOUR DICE:</h3>
            <div className="grid grid-cols-3 gap-3 justify-items-center max-w-[300px] mx-auto">
              {playerRolls.map((roll, idx) => (
                <Dice3D
                  key={`player-${idx}-${roll}`}
                  value={roll}
                  isRolling={false}
                  glowColor="cyan"
                  canClick={false}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-mono text-red-300">PROTOCOL DICE:</h3>
            <div className="grid grid-cols-3 gap-3 justify-items-center max-w-[300px] mx-auto">
              {opponentRolls.map((roll, idx) => (
                <Dice3D
                  key={`opponent-${idx}-${roll}`}
                  value={roll}
                  isRolling={false}
                  glowColor="red"
                  canClick={false}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-center py-8">
          <div className="scale-[2.5] mt-20">
            <Dice3D
              key="universal-dice"
              value={
                gamePhase === "COMPUTER_ROLLING"
                  ? currentComputerRoll || undefined
                  : undefined
              }
              isRolling={gamePhase === "PLAYER_ROLLING"}
              autoRoll={gamePhase === "COMPUTER_ROLLING" && isComputerRolling}
              glowColor={gamePhase === "COMPUTER_ROLLING" ? "red" : "cyan"}
              canClick={
                gamePhase === "PLAYER_TURN" && !isRolling && diceCallbackEnabled
              }
              onRollComplete={
                diceCallbackEnabled || gamePhase === "COMPUTER_ROLLING"
                  ? onDiceRollComplete
                  : undefined
              }
            />
          </div>
        </div>

        {gamePhase === "PLAYER_TURN" && diceCallbackEnabled && (
          <div className="flex justify-center w-full">
            <Button
              onClick={onRoll}
              onMouseEnter={() => playSound("hover")}
              disabled={isRolling || playerRolls.length >= 5}
              className="w-auto min-w-[300px] max-w-[400px] bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xl py-4 px-6 rounded-lg border-0 shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-20 mb-10"
            >
              {isRolling ? <>ROLLING...</> : <>🎲 ROLL DICE</>}
            </Button>
          </div>
        )}

        {gamePhase === "COMPUTER_ROLLING" && (
          <div className="text-2xl font-mono text-red-400 mt-20">
            🤖 PROTOCOL PROCESSING...
          </div>
        )}
      </div>
    </Card>
  );
};

//22
