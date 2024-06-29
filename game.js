import { TargetsFactory } from "./targets_factory.js";
import { GameState } from "./game_state.js";
import { Judgment } from "./judgment.js";
import { TimeManager } from "./time_manager.js";
import { GameScreen } from "./game_screen.js";

export class Game {
  #targetsFactory;
  #gameState;

  constructor({ level, playTime, pointToWin }) {
    this.#targetsFactory = new TargetsFactory(level);
    const targets = this.#targetsFactory.generate();
    this.#gameState = new GameState({ level, targets, playTime, pointToWin });
  }

  async play() {
    await this.#startTyping();
    return this.#gameState.score;
  }

  async #startTyping() {
    try {
      await Promise.all([
        this.#updateTargetsAndOutputPlayScreen(),
        this.#acceptUserInputAndToScore(),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        throw error;
      }
    }
  }

  #updateTargetsAndOutputPlayScreen() {
    const delay = 50;
    const timeManager = new TimeManager(this.#gameState.endTime);

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        this.#updateTargets();
        this.#outputPlayScreen();
        this.#endIntervalIfTimeOver(timeManager, interval, resolve);
      }, delay);
    });
  }

  #updateTargets() {
    this.#gameState.targets = this.#targetsFactory.update(
      this.#gameState.targets,
      this.#gameState.hitWords
    );
  }

  #outputPlayScreen() {
    const gameScreen = new GameScreen(
      this.#gameState.score,
      this.#gameState.pointToWin,
      this.#gameState.endTime,
      this.#gameState.targets,
      this.#gameState.hitString
    );

    const playScreen = gameScreen.buildPlayScreen();
    console.clear();
    console.log(playScreen);
  }

  #endIntervalIfTimeOver(timeManager, interval, resolve) {
    if (timeManager.isTimeOver()) {
      clearInterval(interval);
      resolve();
    }
  }

  #acceptUserInputAndToScore() {
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");

    return new Promise((resolve, reject) => {
      this.#endUserInputIfTimeOut(resolve);

      process.stdin.on("data", (char) => {
        if (char === "\u0003") {
          // Ctrl+C が押された場合、ゲームを終了する
          process.exit();
        } else {
          this.#toScore(char);
        }
      });

      process.stdin.on("error", () => {
        reject(new Error("入力中にエラーが発生しました。"));
        process.stdin.pause();
      });
    });
  }

  #endUserInputIfTimeOut(resolve) {
    setTimeout(() => {
      process.stdin.pause();
      resolve();
    }, this.#gameState.playTime);
  }

  #toScore(char) {
    const hitCheckString = this.#gameState.hitString.concat(char);
    const judgment = new Judgment(this.#gameState.targetWords);
    const isHitWord = judgment.isHitWord(hitCheckString);
    const isHitString = judgment.isHitString(
      hitCheckString,
      this.#gameState.consecutiveHitCount
    );

    this.#addPointAndUpdateGameState(
      isHitWord,
      isHitString,
      hitCheckString,
      char
    );
  }

  #addPointAndUpdateGameState(isHitWord, isHitString, word, char) {
    if (isHitWord) {
      this.#gameState.addBonusPoint();
      this.#gameState.addHitWords(word);
      this.#resetHitCountAndHitChars();
    } else if (isHitString) {
      this.#gameState.addNormalPoint();
      this.#addHitCountAndHitChars(char);
    } else {
      this.#resetHitCountAndHitChars();
    }
  }

  #resetHitCountAndHitChars() {
    this.#gameState.resetConsecutiveHitCount();
    this.#gameState.resetConsecutiveHitChars();
  }

  #addHitCountAndHitChars(char) {
    this.#gameState.addConsecutiveHitCount();
    this.#gameState.addConsecutiveHitChars(char);
  }
}
