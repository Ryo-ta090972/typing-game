import { Score } from "./score.js";
import { TargetsFactory } from "./targets_factory.js";
import { Judgment } from "./judgement.js";
import { TimeManager } from "./time_manager.js";
import { GameScreen } from "./game_screen.js";

export class Game {
  #targetsFactory;
  #targets;
  #score;
  #hittingWords;
  #consecutiveHitCount;
  #playTime;
  #endingTime;
  #stagePoint;

  constructor(level) {
    this.#targetsFactory = new TargetsFactory(level);
    this.#targets = this.#targetsFactory.generate();
    this.#score = new Score(level);
    this.#hittingWords = [];
    this.#consecutiveHitCount = 0;
    this.#playTime = 100000;
    this.#endingTime = Date.now() + this.#playTime;
    this.#stagePoint = 100;
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
      this.#stagePoint,
      this.#endingTime,
      this.#targets,
      this.#hittingWords.join("")
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
    const shootingWord = this.#hittingWords.join("").concat(shoot);
    const targetWords = this.#fetchTargetWords();
    const judgement = new Judgment(targetWords);
    const isPerfectHit = judgement.isPerfectHit(shootingWord);
    const isHit = judgement.isHit(shootingWord, this.#consecutiveHitCount);

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
