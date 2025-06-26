"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import Dice from "react-dice-roll";
import type { Dice3DProps } from "@/types";

export default function Dice3D({
  value = undefined,
  isRolling = false,
  onRollComplete,
  glowColor = "cyan",
  canClick = true,
  autoRoll = false,
}: Dice3DProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const diceRef = useRef<any>(null);
  const [shouldRoll, setShouldRoll] = useState(false);
  const rollCompletedRef = useRef(false);

  useEffect(() => {
    if (isRolling || autoRoll) {
      rollCompletedRef.current = false;
      console.log("🔄 Reset rollCompletedRef for new roll");
    }
  }, [isRolling, autoRoll]);

  useEffect(() => {
    console.log("🔄 Dice3D useEffect triggered:", {
      isRolling,
      autoRoll,
      shouldRoll,
      glowColor,
      hasOnRollComplete: !!onRollComplete,
      timestamp: Date.now(),
    });

    if (
      (isRolling || autoRoll) &&
      diceRef.current &&
      !shouldRoll &&
      !rollCompletedRef.current
    ) {
      console.log("🎯 Starting dice roll animation:", {
        isRolling,
        autoRoll,
        glowColor,
      });
      setShouldRoll(true);

      setTimeout(() => {
        if (diceRef.current?.rollDice) {
          console.log("🎲 Calling rollDice() method");
          diceRef.current.rollDice();
        }
      }, 100);
    }
  }, [isRolling, autoRoll, shouldRoll, glowColor]);

  const handleRoll = useCallback(
    (rolledValue: number) => {
      console.log("🎲 Dice3D handleRoll called:", {
        rolledValue,
        value,
        hasOnRollComplete: !!onRollComplete,
        glowColor,
        rollCompleted: rollCompletedRef.current,
        timestamp: Date.now(),
      });

      if (rollCompletedRef.current) {
        console.log("🚫 Roll already completed, ignoring duplicate callback");
        return;
      }

      setShouldRoll(false);
      rollCompletedRef.current = true;

      if (onRollComplete) {
        console.log("✅ Calling onRollComplete with:", rolledValue);
        onRollComplete(rolledValue);
      } else {
        console.log("🚫 onRollComplete not defined, skipping");
      }
    },
    [value, onRollComplete, glowColor]
  );

  const handleClick = () => {
    if (canClick && !isRolling && !shouldRoll && diceRef.current) {
      setShouldRoll(true);
      setTimeout(() => {
        if (diceRef.current?.rollDice) {
          diceRef.current.rollDice();
        }
      }, 100);
    }
  };

  return (
    <div className="relative flex items-center justify-center">
      <div
        onClick={handleClick}
        className={`${canClick ? "cursor-pointer" : "cursor-default"} ${
          glowColor === "cyan"
            ? isRolling || autoRoll
              ? "shadow-[0_0_30px_rgba(0,255,255,0.8)] rounded-lg"
              : "shadow-[0_0_20px_rgba(0,255,255,0.5)] rounded-lg"
            : glowColor === "red"
            ? isRolling || autoRoll
              ? "shadow-[0_0_30px_rgba(255,0,0,0.8)] rounded-lg"
              : "shadow-[0_0_20px_rgba(255,0,0,0.5)] rounded-lg"
            : isRolling || autoRoll
            ? "shadow-[0_0_30px_rgba(0,255,0,0.8)] rounded-lg"
            : "shadow-[0_0_20px_rgba(0,255,0,0.5)] rounded-lg"
        } transition-all duration-300`}
      >
        <Dice
          ref={diceRef}
          onRoll={handleRoll}
          rollingTime={1200}
          size={window.innerWidth < 640 ? 65 : 80}
          defaultValue={
            value
              ? (Math.max(1, Math.min(6, value)) as 1 | 2 | 3 | 4 | 5 | 6)
              : 1
          }
          cheatValue={
            value
              ? (Math.max(1, Math.min(6, value)) as 1 | 2 | 3 | 4 | 5 | 6)
              : undefined
          }
          disabled={true}
          faceBg={
            glowColor === "cyan"
              ? "#001122"
              : glowColor === "red"
              ? "#220011"
              : "#112200"
          }
          triggers={[]}
        />
      </div>
    </div>
  );
}
