import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/useToast";
import type { NameInputProps } from "@/types";

export const NameInput = ({ onStart }: NameInputProps) => {
  const [playerName, setPlayerName] = useState("");
  const { playSound } = useSound();
  const { showToast } = useToast();

  const handleStart = () => {
    if (!playerName.trim()) {
      showToast("💀 ENTER YOUR IDENTIFIER TO PROCEED", "error");
      return;
    }

    playSound("click");
    onStart(playerName);
    showToast(
      `🎯 WELCOME ${playerName.toUpperCase()} - PROTOCOL INITIATED`,
      "success"
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-rain"></div>
      </div>

      <Card className="bg-black/90 border-2 border-cyan-400 p-8 max-w-lg w-full backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,255,0.3)]">
        <div className="text-center space-y-6">
          <div className="text-4xl font-bold text-cyan-400 font-mono mb-2">
            🎲 DICE PROTOCOL 🎲
          </div>

          <div className="text-lg text-cyan-300 font-mono">
            IDENTITY VERIFICATION REQUIRED
          </div>

          <div className="space-y-4">
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleStart()}
              placeholder="ENTER YOUR IDENTIFIER..."
              className="bg-black border-cyan-400 text-cyan-300 font-mono text-lg text-center placeholder:text-cyan-600 focus:border-cyan-300 focus:ring-cyan-300"
              maxLength={20}
            />

            <Button
              onClick={handleStart}
              onMouseEnter={() => playSound("hover")}
              disabled={!playerName.trim()}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono text-xl py-4 border-0 shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:shadow-[0_0_30px_rgba(0,255,255,0.8)] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              ⚡ INITIATE PROTOCOL ⚡
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
