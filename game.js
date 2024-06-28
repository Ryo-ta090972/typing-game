import { Score } from "./score.js";
import { TargetsFactory } from "./targets_factory.js";
import { Judgment } from "./judgment.js";
import { TimeManager } from "./time_manager.js";
import { GameScreen } from "./game_screen.js";

export class Game {
  #targetsFactory;
  #targets;
  #score;
  #playTime;
  #endTime;
  #pointToWin;
  #consecutiveHitCount;
  #consecutiveHitChars;
  #hitWords;

  constructor(level) {
    this.#targetsFactory = new TargetsFactory(level);
    this.#targets = this.#targetsFactory.generate();
    this.#score = new Score(level);
    this.#playTime = 10000;
    this.#endTime = Date.now() + this.#playTime;
    this.#pointToWin = 100;
    this.#consecutiveHitCount = 0;
    this.#consecutiveHitChars = [];
    this.#hitWords = [];
  }

  async play() {
    await this.#startTyping();
    return this.#score.totalPoint;
  }

  async #startTyping() {
    try {
      await Promise.all([
        this.#updateTargetsAndOutputGameScreen(),
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

  #updateTargetsAndOutputGameScreen() {
    const delay = 50;
    const timeManager = new TimeManager(this.#endTime);

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        this.#targets = this.#targetsFactory.update(
          this.#targets,
          this.#hitWords
        );
        this.#outputPlayScreen();

        if (timeManager.isTimeOver()) {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  }

  #outputPlayScreen() {
    const gameScreen = new GameScreen(
      this.#score.totalPoint,
      this.#pointToWin,
      this.#endTime,
      this.#targets,
      this.#consecutiveHitChars.join("")
    );

    const playScreen = gameScreen.buildPlayScreen();
    console.clear();
    console.log(playScreen);
  }

  #acceptUserInputAndToScore() {
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        process.stdin.pause();
        resolve();
      }, this.#playTime);

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

  #toScore(char) {
    const hitCheckString = this.#consecutiveHitChars.join("").concat(char);
    const targetWords = this.#fetchTargetWords();
    const judgment = new Judgment(targetWords);
    const isHitWord = judgment.isHitWord(hitCheckString);
    const isHitString = judgment.isHitString(
      hitCheckString,
      this.#consecutiveHitCount
    );

    this.#addPointAndUpdateProperty(
      isHitWord,
      isHitString,
      hitCheckString,
      char
    );
  }

  #fetchTargetWords() {
    const targetWords = [];

    this.#targets.forEach((target) => {
      targetWords.push(target.word);
    });

    return targetWords;
  }

  #addPointAndUpdateProperty(isHitWord, isHitString, word, char) {
    if (isHitWord) {
      this.#score.addBonusPoint();
      this.#hitWords.push(word);
      this.#resetProperty();
    } else if (isHitString) {
      this.#score.addNormalPoint();
      this.#saveProperty(char);
    } else {
      this.#resetProperty();
    }
  }

  #resetProperty() {
    this.#consecutiveHitCount = 0;
    this.#consecutiveHitChars = [];
  }

  #saveProperty(char) {
    this.#consecutiveHitCount++;
    this.#consecutiveHitChars.push(char);
  }
}
