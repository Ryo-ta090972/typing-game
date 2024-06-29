import { Score } from "./score.js";

export class GameState {
  #score;
  #targets;
  #playTime;
  #endTime;
  #pointToWin;
  #consecutiveHitCount;
  #consecutiveHitChars;
  #hitWords;

  constructor({ level, targets, playTime, pointToWin }) {
    this.#score = new Score(level);
    this.#targets = targets;
    this.#playTime = playTime;
    this.#endTime = Date.now() + this.#playTime;
    this.#pointToWin = pointToWin;
    this.#consecutiveHitCount = 0;
    this.#consecutiveHitChars = [];
    this.#hitWords = [];
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

  get pointToWin() {
    return this.#pointToWin;
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

  set targets(targets) {
    this.#targets = targets;
  }

  addNormalPoint() {
    this.#score.addNormalPoint();
  }

  addBonusPoint() {
    this.#score.addBonusPoint();
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
}
