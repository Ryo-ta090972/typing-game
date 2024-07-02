export class Score {
  #level;
  #normalPoint;
  #bonusPoint;
  #pointLists = {
    veryEasy: { normal: 2, bonus: 4 },
    easy: { normal: 1, bonus: 3 },
    normal: { normal: 1, bonus: 2 },
    hard: { normal: 0, bonus: 1.5 },
    veryHard: { normal: 0, bonus: 1 },
  };

  constructor(level) {
    this.#level = level;
    this.#normalPoint = 0;
    this.#bonusPoint = 0;
  }

  get totalPoint() {
    return this.#normalPoint + this.#bonusPoint;
  }

  addNormalPoint() {
    const point = this.#pointLists[this.#level]["normal"];
    this.#normalPoint += point;
  }

  addBonusPoint(word) {
    const bonusRate = this.#pointLists[this.#level]["bonus"];
    this.#bonusPoint += word.length * bonusRate;
  }
}
