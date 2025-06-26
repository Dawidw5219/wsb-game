import {
  TOTAL_ROLLS,
  DICE_MIN,
  DICE_MAX,
  rollDice,
  calculateScore,
  determineWinner,
  isGameComplete,
  getGameResultMessage,
  getPressureMessage,
  isValidRoll,
} from "./GameLogicService";

export { TOTAL_ROLLS, DICE_MIN, DICE_MAX };

export class GameService {
  rollSingleDice(): number {
    return Math.floor(Math.random() * DICE_MAX) + DICE_MIN;
  }

  rollComputerDice(): number[] {
    const rolls = [];
    for (let i = 0; i < TOTAL_ROLLS; i++) {
      const roll = Math.floor(Math.random() * DICE_MAX) + DICE_MIN;
      rolls.push(roll);
    }
    return rolls;
  }

  rollComputerDiceProgressive(): number[] {
    const rolls = [];

    for (let i = 0; i < TOTAL_ROLLS; i++) {
      const roll = Math.floor(Math.random() * DICE_MAX) + DICE_MIN;
      rolls.push(roll);
    }
    return rolls;
  }

  calculateScore(rolls: number[]): number {
    return calculateScore(rolls);
  }

  determineWinner(
    playerScore: number,
    computerScore: number
  ): "player" | "computer" | "tie" {
    return determineWinner(playerScore, computerScore);
  }

  isGameComplete(rolls: number[]): boolean {
    return isGameComplete(rolls);
  }

  getGameResultMessage(
    winner: string,
    playerScore: number,
    computerScore: number
  ): string {
    return getGameResultMessage(winner, playerScore, computerScore);
  }

  getPressureMessage(
    rollNumber: number,
    currentRoll: number,
    currentSum: number
  ): string {
    return getPressureMessage(rollNumber, currentRoll, currentSum);
  }

  isValidRoll(roll: number): boolean {
    return isValidRoll(roll);
  }

  getMaxScore(): number {
    return DICE_MAX * TOTAL_ROLLS;
  }

  calculateWinPercentage(playerScore: number, computerScore: number): number {
    const total = playerScore + computerScore;
    return total > 0 ? Math.round((playerScore / total) * 100) : 0;
  }

  getMotivationalQuote(): string {
    const quotes = [
      "Every roll is a new chance! 🎲",
      "Luck favors the persistent! ⭐",
      "You've got this! 💪",
      "Fair play makes victory sweeter! 🏆",
      "Each game is 50/50 - as it should be! ⚖️",
      "Your skills are improving! 📈",
      "Random is fair, and fair is fun! 🎯",
      "May the odds be ever in everyone's favor! 🍀",
      "Win or lose, you played fairly! 👏",
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  playGame(gameCount: number = 1) {
    return rollDice(gameCount);
  }
}

export const gameService = new GameService();
