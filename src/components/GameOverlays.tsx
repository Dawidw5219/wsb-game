import { Button } from "@/components/ui/button";
import { useSound } from "@/hooks/useSound";
import type { TransitionOverlayProps, EliminationOverlayProps } from "@/types";

export const TransitionOverlay = ({ isVisible }: TransitionOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold mb-4 animate-pulse">🎲</div>
        <div className="text-3xl font-mono text-cyan-400">
          PROCESSING COMBAT RESULTS...
        </div>
      </div>
    </div>
  );
};

export const EliminationOverlay = ({
  isVisible,
  playerName,
  onRestart,
}: EliminationOverlayProps) => {
  const { playSound } = useSound();

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        <div className="text-8xl font-bold mb-6 text-red-400 animate-pulse">
          💀
        </div>
        <div className="text-4xl font-bold text-red-400 font-mono">
          {playerName.toUpperCase()} TERMINATED
        </div>
        <div className="text-xl text-red-300">PROCESS EXECUTION FAILED</div>
        <Button
          onClick={onRestart}
          onMouseEnter={() => playSound("hover")}
          className="bg-red-600 hover:bg-red-500 text-white font-mono text-xl py-4 px-8 border-0 shadow-[0_0_20px_rgba(255,0,0,0.5)] cursor-pointer"
        >
          🔄 RESTART PROTOCOL
        </Button>
      </div>
    </div>
  );
};
