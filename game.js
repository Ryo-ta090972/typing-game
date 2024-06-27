import { Score } from "./score.js";
import { TargetsFactory } from "./targets_factory.js";
import { Judgment } from "./judgement.js";
import { TimeManager } from "./time_manager.js";

export class Game {
  #targetsFactory;
  #targets;
  #score;
  #hittingWords;
  #consecutiveHitCount;
  #playTime;
  #endingTime;

  constructor(level) {
    this.#targetsFactory = new TargetsFactory(level);
    this.#targets = this.#targetsFactory.generate();
    this.#score = new Score(level);
    this.#hittingWords = [];
    this.#consecutiveHitCount = 0;
    this.#playTime = 3000;
    this.#endingTime = Date.now() + this.#playTime;
  }

  async play() {
    const point = this.#startTyping();
    return point;
  }

  async #startTyping() {
    try {
      await Promise.all([
        this.#updateTargetsAndOutputGameScreen(),
        this.#acceptUserInputAndToScore(),
      ]);
      return this.#score.totalPoint;
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
    const timeManager = new TimeManager(this.#endingTime);

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        this.#targets = this.#targetsFactory.update(this.#targets);
        this.#outputGameScreen();

        if (timeManager.isTimeOver()) {
          clearInterval(interval);
          resolve();
        }
      }, delay);
    });
  }

  #outputGameScreen() {
    console.clear();
    console.log(this.#score.totalPoint);
    console.log(this.#hittingWords.join(""));
    console.log(`現在の時間：${Date.now()}`);
    console.log(`終了時間：${this.#endingTime}`);
    console.log("");

    this.#targets.forEach((target) => {
      console.log(`出題単語：${target.word}`);
      console.log(`切り替わる時間：${target.endingTime}`);
      console.log("");
    });
  }

  #acceptUserInputAndToScore() {
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        process.stdin.pause();
        resolve();
      }, this.#playTime);

      process.stdin.on("data", (shoot) => {
        if (shoot === "\u0003") {
          // Ctrl+C が押された場合、ゲームを終了する
          process.exit();
        } else {
          this.#toScore(shoot);
        }
      });

      process.stdin.on("error", () => {
        reject(new Error("入力中にエラーが発生しました。"));
        process.stdin.pause();
      });
    });
  }

  #toScore(shoot) {
    const hittingWord = this.#hittingWords.join("");
    const targetWords = this.#fetchTargetWords();
    const judgement = new Judgment(targetWords);
    const isPerfectHit = judgement.isPerfectHit(shoot, hittingWord);
    const isHit = judgement.isHit(
      shoot,
      hittingWord,
      this.#consecutiveHitCount
    );

    this.#giveScoreAndChangeState(isPerfectHit, isHit, shoot);
  }

  #fetchTargetWords() {
    const targetWords = [];

    this.#targets.forEach((target) => {
      targetWords.push(target.word);
    });
    return targetWords;
  }

  #giveScoreAndChangeState(isPerfectHit, isHit, shoot) {
    if (isPerfectHit) {
      this.#score.addBonusPoint();
      this.#resetState();
    } else if (isHit) {
      this.#score.addNormalPoint();
      this.#saveState(shoot);
    } else {
      this.#resetState();
    }
  }
  #resetState() {
    this.#hittingWords = [];
    this.#consecutiveHitCount = 0;
  }

  #saveState(shoot) {
    this.#hittingWords.push(shoot);
    this.#consecutiveHitCount++;
  }
}
