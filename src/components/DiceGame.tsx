"use client";

import { useState, useRef } from "react";
import { GameBackground } from "@/components/GameBackground";
import { NameInput } from "@/components/NameInput";
import { DiceArea } from "@/components/DiceArea";
import { GameResults } from "@/components/GameResults";
import { GameLeaderboard } from "@/components/GameLeaderboard";
import { TransitionOverlay } from "@/components/GameOverlays";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/useToast";
import { useSupabase } from "@/hooks/useSupabase";
import type { GameResult } from "@/types";

type GamePhase =
  | "PLAYER_TURN"
  | "PLAYER_ROLLING"
  | "COMPUTER_ROLLING"
  | "GAME_ENDED";

export default function DiceGame() {
  const [playerName, setPlayerName] = useState("");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [gamePhase, setGamePhase] = useState<GamePhase>("PLAYER_TURN");
  const [playerWins, setPlayerWins] = useState(0);
  const [playerLosses, setPlayerLosses] = useState(0);
  const [playerRolls, setPlayerRolls] = useState<number[]>([]);
  const [opponentRolls, setOpponentRolls] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentComputerRoll, setCurrentComputerRoll] = useState<number | null>(
    null
  );
  const [diceCallbackEnabled, setDiceCallbackEnabled] = useState(true);

  const playerRollInProgress = useRef(false);
  const computerRollInProgress = useRef(false);

  const { playSound } = useSound();
  const { showToast } = useToast();
  const {
    players,
    recentGames,
    currentPlayer,
    initializing,
    createOrGetPlayer,
    saveGame,
  } = useSupabase();

  const handleGameStart = async (name: string) => {
    setPlayerName(name);
    try {
      await createOrGetPlayer(name);
      setGameStarted(true);
    } catch {
      showToast("💣 Error setting up player", "error");
    }
  };

  const rollPlayerDice = async () => {
    if (
      gamePhase !== "PLAYER_TURN" ||
      playerRolls.length >= 5 ||
      playerRollInProgress.current
    )
      return;

    console.log("Player rolling dice:", { currentDice: playerRolls.length });

    playSound("click");
    setGamePhase("PLAYER_ROLLING");
  };

  const handleRollComplete = (roll: number) => {
    console.log("🎲 Universal handleRollComplete called:", {
      roll,
      gamePhase,
      playerRollsLength: playerRolls.length,
      opponentRollsLength: opponentRolls.length,
      timestamp: Date.now(),
    });

    if (gamePhase === "PLAYER_ROLLING") {
      if (playerRollInProgress.current) {
        console.log("🚫 Player roll already in progress, ignoring duplicate");
        return;
      }

      if (playerRolls.length >= 5) {
        console.log("🚫 Player already has 5 dice, ignoring");
        return;
      }

      console.log("✅ Processing player roll");
      playerRollInProgress.current = true;
      setDiceCallbackEnabled(false);

      showToast(`🎲 YOUR DICE ${playerRolls.length + 1}: ${roll}`, "info");
      const newPlayerRolls = [...playerRolls, roll];
      setPlayerRolls(newPlayerRolls);
      playerRollInProgress.current = false;

      setTimeout(() => {
        setGamePhase("COMPUTER_ROLLING");
        rollComputerDice(newPlayerRolls.length);
      }, 800);
    } else if (gamePhase === "COMPUTER_ROLLING") {
      if (!computerRollInProgress.current) return;

      showToast(
        `🤖 PROTOCOL DICE ${opponentRolls.length + 1}: ${roll}`,
        "info"
      );
      const newOpponentRolls = [...opponentRolls, roll];
      setOpponentRolls(newOpponentRolls);
      setCurrentComputerRoll(null);
      computerRollInProgress.current = false;

      console.log("Computer rolled:", {
        computerDice: newOpponentRolls.length,
        playerDice: playerRolls.length,
        shouldEndGame:
          newOpponentRolls.length === 5 && playerRolls.length === 5,
      });

      if (newOpponentRolls.length === 5 && playerRolls.length === 5) {
        console.log("ENDING GAME - both have 5 dice");

        setTimeout(() => {
          executeGame(playerRolls, newOpponentRolls);
        }, 1000);
      } else {
        console.log("Continuing game - next player turn");

        setTimeout(() => {
          setGamePhase("PLAYER_TURN");
          setDiceCallbackEnabled(true);
        }, 800);
      }
    } else {
      console.log("🚫 Roll complete called during wrong phase:", gamePhase);
    }
  };

  const rollComputerDice = async (
    currentPlayerDiceCount: number = playerRolls.length
  ) => {
    console.log("🔍 rollComputerDice called:", {
      currentPlayerDiceCount,
      computerRollInProgress: computerRollInProgress.current,
      opponentRollsLength: opponentRolls.length,
      gamePhase,
      isComputerRolling: gamePhase === "COMPUTER_ROLLING",
    });

    if (computerRollInProgress.current) {
      console.log("🚫 Computer roll already in progress, ignoring duplicate");
      return;
    }

    if (opponentRolls.length >= 5) {
      console.log("🚫 Computer already has 5 dice, ignoring");
      return;
    }

    if (gamePhase === "COMPUTER_ROLLING") {
      console.log("🚫 Computer already rolling, ignoring duplicate");
      return;
    }

    if (opponentRolls.length >= currentPlayerDiceCount) {
      console.log("🚫 Computer already rolled for this round, ignoring");
      return;
    }

    const currentOpponentDiceCount = opponentRolls.length;

    console.log("✅ Setting computerRollInProgress to true");
    computerRollInProgress.current = true;

    const roll = Math.floor(Math.random() * 6) + 1;
    const diceNumber = currentOpponentDiceCount + 1;

    setCurrentComputerRoll(roll);
    setGamePhase("COMPUTER_ROLLING");

    console.log("Computer dice animation starting:", {
      dice: diceNumber,
      roll: roll,
      currentOpponentDiceCount,
    });
  };

  const executeGame = async (
    manualRolls: number[],
    opponentRollsArray: number[]
  ) => {
    setIsTransitioning(true);

    const playerTotal = manualRolls.reduce((a, b) => a + b, 0);
    const opponentTotal = opponentRollsArray.reduce((a, b) => a + b, 0);

    const { determineWinner } = await import("@/services/GameLogicService");
    const winner = determineWinner(playerTotal, opponentTotal);

    const result = {
      playerRolls: manualRolls,
      opponentRolls: opponentRollsArray,
      playerTotal,
      opponentTotal,
      playerWins: winner === "player",
      stressLevel: "LOW" as const,
      survivalMessage: "",
      isEliminated: false,
      survivalRound: 1,
    };

    setGameResult(result);
    setShowResults(true);
    setIsTransitioning(false);

    const isWin = winner === "player";
    await saveGame(manualRolls, opponentRollsArray, isWin);

    if (isWin) {
      setPlayerWins(playerWins + 1);
      playSound("win");
      showToast(
        `🏆 VICTORY! [${result.playerTotal} vs ${result.opponentTotal}]`,
        "success"
      );
    } else if (winner === "tie") {
      playSound("click");
      showToast(
        `🤝 TIE! [${result.playerTotal} vs ${result.opponentTotal}] - Try again!`,
        "info"
      );
    } else {
      setPlayerLosses(playerLosses + 1);
      playSound("lose");
      showToast(
        `💀 DEFEATED! [${result.playerTotal} vs ${result.opponentTotal}]`,
        "error"
      );
    }

    console.log("✅ Game completed - realtime will update UI automatically");
  };

  const tryAgain = () => {
    playSound("click");
    setGameResult(null);
    setPlayerRolls([]);
    setOpponentRolls([]);
    setGamePhase("PLAYER_TURN");
    setShowResults(false);
    setIsTransitioning(false);
    setCurrentComputerRoll(null);
    setDiceCallbackEnabled(true);

    playerRollInProgress.current = false;
    computerRollInProgress.current = false;

    showToast("🎯 NEW GAME STARTED", "info");
  };

  const resetGame = () => {
    setPlayerName("");
    setGameStarted(false);
    setGameResult(null);
    setPlayerRolls([]);
    setOpponentRolls([]);
    setGamePhase("PLAYER_TURN");
    setShowResults(false);
    setIsTransitioning(false);
    setCurrentComputerRoll(null);
    setDiceCallbackEnabled(true);

    playerRollInProgress.current = false;
    computerRollInProgress.current = false;
  };

  if (!gameStarted) {
    return <NameInput onStart={handleGameStart} />;
  }

  return (
    <GameBackground>
      <TransitionOverlay isVisible={isTransitioning} />

      <div className="container mx-auto p-2 sm:p-4 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 min-h-screen relative z-10">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="text-center py-2 sm:py-4">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-cyan-400 mb-2">
              🎯 {playerName.toUpperCase()} VS PROTOCOL 🎯
            </h1>
            <div className="text-sm sm:text-base lg:text-lg text-cyan-300">
              SESSION: W:{playerWins} L:{playerLosses}
            </div>
          </div>

          {!showResults && (
            <DiceArea
              playerRolls={playerRolls}
              opponentRolls={opponentRolls}
              gamePhase={gamePhase}
              isComputerRolling={gamePhase === "COMPUTER_ROLLING"}
              currentComputerRoll={currentComputerRoll}
              diceCallbackEnabled={diceCallbackEnabled}
              onRoll={rollPlayerDice}
              onDiceRollComplete={handleRollComplete}
            />
          )}

          {gameResult && showResults && (
            <GameResults
              isVisible={showResults}
              gameResult={gameResult}
              playerName={playerName}
              onTryAgain={tryAgain}
            />
          )}
        </div>

        <GameLeaderboard
          players={players}
          recentGames={recentGames}
          currentPlayer={currentPlayer}
          initializing={initializing}
          onReset={resetGame}
        />
      </div>
    </GameBackground>
  );
}
