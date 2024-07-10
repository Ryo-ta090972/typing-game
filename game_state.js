import { Score } from "./score.js";
import { TargetsFactory } from "./targets_factory.js";

export class GameState {
  #level;
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
    this.#level = level;
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
    return this.#targets.map((target) => target.word);
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

  judgeTargetWords(word) {
    const words = this.#targets.map((target) => target.word);
    return words.includes(word);
  }

  judgeTargetStrings(string, consecutiveHitCount) {
    const strings = this.#targets.map((target) =>
      target.buildString(consecutiveHitCount),
    );

    return strings.includes(string);
  }

  updateTargets() {
    this.#targets = this.#createNewTargets();
  }

  #createNewTargets() {
    const targetsFactory = new TargetsFactory(this.#level);
    const newTargets = this.#targets.map((target) => {
      const newTarget = targetsFactory.createNewTarget({
        targets: this.#targets,
        hitWords: this.#hitWords,
      });

      return this.#isTimeOverOrHitWord(target.endTime, target.word)
        ? newTarget
        : target;
    });

    return newTargets;
  }

  #isTimeOverOrHitWord(endTime, word) {
    const isHitWord = this.#hitWords.includes(word);
    return Date.now() > endTime || isHitWord;
  }
}
