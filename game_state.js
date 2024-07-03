import { Score } from "./score.js";

export class GameState {
  #score;
  #targets;
  #playTime = 60000;
  #endTime = Date.now() + this.#playTime;
  #scoreNeededToWin = 300;
  #consecutiveHitCount = 0;
  #consecutiveHitChars = [];
  #hitWords = [];
  #isGameWon = false;

  constructor(level, targets) {
    this.#score = new Score(level);
    this.#targets = targets;
  }

  get score() {
    return this.#score.totalPoint;
  }

  get targets() {
    return this.#targets;
  }

  get targetWords() {
    const targetWords = [];

    this.#targets.forEach((target) => {
      targetWords.push(target.word);
    });

    return targetWords;
  }

  get playTime() {
    return this.#playTime;
  }

  get endTime() {
    return this.#endTime;
  }

  get scoreNeededToWin() {
    return this.#scoreNeededToWin;
  }

  get consecutiveHitCount() {
    return this.#consecutiveHitCount;
  }

  get hitString() {
    return this.#consecutiveHitChars.join("");
  }

  get hitWords() {
    return this.#hitWords;
  }

  get isGameWon() {
    return this.#isGameWon;
  }

  set targets(targets) {
    this.#targets = targets;
  }

  addNormalPoint() {
    this.#score.addNormalPoint();
  }

  addBonusPoint(word) {
    this.#score.addBonusPoint(word);
  }

  addConsecutiveHitCount() {
    this.#consecutiveHitCount++;
  }

  addConsecutiveHitChars(char) {
    this.#consecutiveHitChars.push(char);
  }

  addHitWords(word) {
    this.#hitWords.push(word);
  }

  resetConsecutiveHitCount() {
    this.#consecutiveHitCount = 0;
  }

  resetConsecutiveHitChars() {
    this.#consecutiveHitChars = [];
  }

  winGame() {
    this.#isGameWon = true;
  }
}
