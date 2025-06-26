export const TOTAL_ROLLS = 5;
export const DICE_MIN = 1;
export const DICE_MAX = 6;

import type { GameResult, RollResult, VictimStatus } from "@/types";

export function rollDice(gameCount: number = 1): GameResult {
  const playerRolls = generateFairRolls();
  const opponentRolls = generateFairRolls();

  const playerTotal = playerRolls.reduce((a, b) => a + b, 0);
  const opponentTotal = opponentRolls.reduce((a, b) => a + b, 0);
  const playerWins = playerTotal > opponentTotal;

  const survivalMessage = generateFairMessage(gameCount, playerWins);
  const isEliminated = !playerWins;

  return {
    playerRolls,
    opponentRolls,
    playerTotal,
    opponentTotal,
    playerWins,
    survivalMessage,
    isEliminated,
    survivalRound: gameCount,
  };
}

export function generateAlternatingRolls(): RollResult[] {
  const rolls: RollResult[] = [];

  for (let i = 0; i < 10; i++) {
    const isPlayer = i % 2 === 0;
    const rollIndex = Math.floor(i / 2);

    const value = Math.floor(Math.random() * 6) + 1;

    rolls.push({
      value,
      isPlayer,
      rollIndex,
    });
  }

  return rolls;
}

function generateFairRolls(): number[] {
  const rolls: number[] = [];

  for (let i = 0; i < 5; i++) {
    rolls.push(Math.floor(Math.random() * 6) + 1);
  }

  return rolls;
}

function generateFairMessage(round: number, playerWins: boolean): string {
  if (!playerWins) {
    return getEliminationMessage();
  }

  const survivalMessages = [
    "Round survived! Moving to the next challenge",
    "Victory! Your skills are showing",
    "Well played! Another round conquered",
    "Excellent! You're getting better",
    "Outstanding! Keep up the momentum",
    "Impressive! Your luck is holding",
    "Fantastic! You're on a roll",
    "Amazing! True skill on display",
    "Incredible! Nothing can stop you",
    "Legendary! You're unstoppable",
  ];

  const messageIndex = Math.min(round - 1, survivalMessages.length - 1);
  return (
    survivalMessages[messageIndex] ||
    survivalMessages[survivalMessages.length - 1]
  );
}

function getEliminationMessage(): string {
  const eliminationMessages = [
    "PROCESS TERMINATED... Your runtime has expired. The garbage collector claims you",
    "SEGMENTATION FAULT... You join the memory dump with countless others",
    "STACK OVERFLOW... Your recursion ends in infinite darkness",
    "NULL POINTER EXCEPTION... Your references dissolve into void",
    "SYSTEM HALT... The debugger finds you wanting",
    "CORE DUMPED... Your consciousness fragments into binary oblivion",
  ];

  return eliminationMessages[
    Math.floor(Math.random() * eliminationMessages.length)
  ];
}

let entities: VictimStatus[] = [];

export function initializeEntities(): VictimStatus[] {
  const entityIds = [
    "NOT_HUMAN_1536",
    "NOT_HUMAN_7842",
    "NOT_HUMAN_3291",
    "NOT_HUMAN_9157",
    "NOT_HUMAN_4683",
    "NOT_HUMAN_2947",
    "NOT_HUMAN_8264",
    "NOT_HUMAN_5739",
    "NOT_HUMAN_1428",
    "NOT_HUMAN_6851",
    "NOT_HUMAN_9372",
    "NOT_HUMAN_4625",
  ];

  entities = entityIds.map((id) => ({
    entityId: id,
    status: "ACTIVE" as const,
    lastPing: new Date(),
  }));

  return entities;
}

export function terminateRandomEntity(): VictimStatus | null {
  const activeEntities = entities.filter((e) => e.status === "ACTIVE");

  if (activeEntities.length === 0) return null;

  const entityIndex = Math.floor(Math.random() * activeEntities.length);
  const entity = activeEntities[entityIndex];

  entity.status = "TERMINATED";
  entity.terminatedAt = new Date();

  return entity;
}

export function getEntitiesList(): VictimStatus[] {
  return entities;
}

export function getActiveCount(): number {
  return entities.filter((e) => e.status === "ACTIVE").length;
}

export function getVictimsList(): VictimStatus[] {
  return getEntitiesList();
}

export function eliminateRandomVictim(): VictimStatus | null {
  return terminateRandomEntity();
}

export function getAliveCount(): number {
  return getActiveCount();
}

export async function revealOpponentRoll(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000 + Math.random() * 1000);
  });
}

export function calculateScore(rolls: number[]): number {
  return rolls.reduce((sum, roll) => sum + roll, 0);
}

export function determineWinner(
  playerScore: number,
  computerScore: number
): "player" | "computer" | "tie" {
  if (playerScore > computerScore) return "player";
  if (computerScore > playerScore) return "computer";
  return "tie";
}

export function isGameComplete(rolls: number[]): boolean {
  return rolls.length >= TOTAL_ROLLS;
}

export function getGameResultMessage(
  winner: string,
  playerScore: number,
  computerScore: number
): string {
  const scoreDiff = Math.abs(playerScore - computerScore);

  if (winner === "tie") {
    const tieMessages = [
      `Great game! ${playerScore} points each - perfectly matched! 🤝`,
      `${playerScore} vs ${playerScore} - what are the odds! Amazing! ⚖️`,
      `Tie game at ${playerScore} each! Both players showed skill! 🎯`,
      `Equal scores ${playerScore}:${playerScore}! Fair and square! 🏆`,
    ];
    return tieMessages[Math.floor(Math.random() * tieMessages.length)];
  }

  if (winner === "player") {
    if (scoreDiff <= 1) {
      const closeWinMessages = [
        `Close victory ${playerScore} vs ${computerScore}! Well played! 🎉`,
        `Won by ${scoreDiff}! That was exciting! 🎯`,
        `${playerScore} vs ${computerScore} - skillful finish! 💪`,
        `Narrow win! Great dice control! 🎲`,
      ];
      return closeWinMessages[
        Math.floor(Math.random() * closeWinMessages.length)
      ];
    } else {
      const bigWinMessages = [
        `Excellent! ${playerScore} vs ${computerScore}! Dominant performance! 💪`,
        `Crushing victory! ${playerScore} vs ${computerScore}! Impressive! 🏆`,
        `${playerScore} vs ${computerScore}! Outstanding dice work! 🌟`,
        `Big win! You're getting really good at this! 🚀`,
      ];
      return bigWinMessages[Math.floor(Math.random() * bigWinMessages.length)];
    }
  }

  if (scoreDiff <= 1) {
    const closeLossMessages = [
      `Close one! ${computerScore} vs ${playerScore} - almost had it! 👏`,
      `${computerScore} vs ${playerScore} - that was really close! 🎯`,
      `Lost by ${scoreDiff} - so close! Next time for sure! 💪`,
      `Narrow defeat! Great effort though! 🎲`,
    ];
    return closeLossMessages[
      Math.floor(Math.random() * closeLossMessages.length)
    ];
  } else if (scoreDiff <= 3) {
    const mediumLossMessages = [
      `${computerScore} vs ${playerScore} - good game! 🎮`,
      `Lost ${computerScore} vs ${playerScore} - better luck next round! 🍀`,
      `Computer wins ${computerScore} vs ${playerScore} - fair match! 🤖`,
      `${scoreDiff} point difference - you'll get it next time! 🎯`,
    ];
    return mediumLossMessages[
      Math.floor(Math.random() * mediumLossMessages.length)
    ];
  } else {
    const bigLossMessages = [
      `${computerScore} vs ${playerScore} - tough round but don't give up! 💪`,
      `Computer dominated ${computerScore} vs ${playerScore} - but that's how you learn! 📚`,
      `Big loss but every game makes you better! ${computerScore} vs ${playerScore} 🌟`,
      `${scoreDiff} point gap - room for improvement! Keep playing! 🎯`,
    ];
    return bigLossMessages[Math.floor(Math.random() * bigLossMessages.length)];
  }
}

export function getPressureMessage(
  rollNumber: number,
  currentRoll: number,
  currentSum: number
): string {
  const encouragingMessages: { [key: number]: string[] } = {
    1: [
      `First roll: ${currentRoll}! Off to a good start! 🎯`,
      `${currentRoll} to begin with! Nice! 🎲`,
      `Roll #1: ${currentRoll}... looking good! 🌟`,
    ],
    2: [
      `Second roll: ${currentRoll}! Total: ${currentSum}... building momentum! 📈`,
      `${currentRoll} on the second! Total ${currentSum} so far! 🎯`,
      `Roll #2: ${currentRoll}... steady progress! 💪`,
    ],
    3: [
      `Third roll: ${currentRoll}! Halfway there with ${currentSum}! 🎮`,
      `${currentRoll} on the third! Sum ${currentSum}... doing great! 🌟`,
      `Midway through: ${currentRoll}... you're in control! 🎯`,
    ],
    4: [
      `Fourth roll: ${currentRoll}! Almost done with ${currentSum}! 🎲`,
      `${currentRoll} on the fourth! One more to go! ⭐`,
      `Roll #4: ${currentRoll}... total ${currentSum}... final roll coming! 🎯`,
    ],
    5: [
      `Final roll: ${currentRoll}! Total score: ${currentSum}! Well done! ⚡`,
      `Complete! ${currentRoll} to finish! Final total: ${currentSum}! 🏁`,
      `Fifth roll: ${currentRoll}! Your final score is ${currentSum}! 🎉`,
    ],
  };

  const messages = encouragingMessages[rollNumber] || [
    `Roll ${rollNumber}: ${currentRoll}! Total: ${currentSum}`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

export function isValidRoll(roll: number): boolean {
  return roll >= DICE_MIN && roll <= DICE_MAX;
}
