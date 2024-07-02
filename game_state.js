import { Score } from "./score.js";

export class GameState {
  #score;
  #targets;
  #playTime;
  #endTime;
  #scoreNeededToWin;
  #consecutiveHitCount;
  #consecutiveHitChars;
  #hitWords;
  #isGameWon = false;

  constructor({ level, targets, scoreNeededToWin }) {
    this.#score = new Score(level);
    this.#targets = targets;
    this.#playTime = 30000;
    this.#endTime = Date.now() + this.#playTime;
    this.#scoreNeededToWin = scoreNeededToWin;
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

  winGame() {
    this.#isGameWon = true;
  }
}
