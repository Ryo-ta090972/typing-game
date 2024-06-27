import { Score } from "./score.js";
import { TargetsFactory } from "./targets_factory.js";
import { Judgment } from "./judgement.js";

export class Game {
  #targetsFactory;
  #targets;
  #score;
  #hittingWords;
  #consecutiveHitCount;

  constructor(level) {
    this.#targetsFactory = new TargetsFactory(level);
    this.#targets = this.#targetsFactory.generate();
    this.#score = new Score(level);
    this.#hittingWords = [];
    this.#consecutiveHitCount = 0;
  }

  play() {
    const delay = 50;

    setInterval(() => this.#updateTargetsAndOutputGameScreen(), delay);
    this.#acceptUserInputAndToScore();
  }

  #updateTargetsAndOutputGameScreen() {
    this.#targets = this.#targetsFactory.update(this.#targets);
    this.#outputGameScreen();
  }

  #outputGameScreen() {
    console.clear();
    console.log(this.#score.totalPoint);
    console.log(this.#hittingWords.join(""));
    console.log(`現在の時間：${Date.now()}`);
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
    process.stdin.on("data", (shoot) => {
      if (shoot === "\u0003") {
        // Ctrl+C が押された場合、ゲームを終了する
        process.exit();
      } else {
        this.#toScore(shoot);
      }
    });
  }

  #toScore(shoot) {
    const targetWords = this.#fetchTargetWords();
    const judgement = new Judgment(targetWords);
    const hittingWord = this.#hittingWords.join("");
    const isPerfectHit = judgement.isPerfectHit(shoot, hittingWord);
    const isHit = judgement.isHit(
      shoot,
      hittingWord,
      this.#consecutiveHitCount
    );

    this.#giveScore(isPerfectHit, isHit);
    this.#changeState(isHit, shoot);
  }

  #fetchTargetWords() {
    const targetWords = [];

    this.#targets.forEach((target) => {
      targetWords.push(target.word);
    });
    return targetWords;
  }

  #giveScore(isPerfectHit, isHit) {
    if (isPerfectHit) {
      console.log("perfect hit!!");
      this.#score.addBonusPoint();
    } else if (isHit) {
      console.log("hit!!!");
      this.#score.addNormalPoint();
    } else {
      console.log("Miss");
    }
  }

  #changeState(isHit, shoot) {
    if (isHit) {
      this.#save(shoot);
    } else {
      this.#reset();
    }
  }

  #save(shoot) {
    this.#hittingWords.push(shoot);
    this.#consecutiveHitCount++;
  }

  #reset() {
    this.#hittingWords = [];
    this.#consecutiveHitCount = 0;
  }
}
