export class Score {
  #level;
  #normalPoint;
  #bonusPoint;
  #pointLists = {
    veryEasy: { normal: 2, bonus: 10 },
    easy: { normal: 2, bonus: 8 },
    normal: { normal: 1, bonus: 6 },
    hard: { normal: 0, bonus: 6 },
    veryHard: { normal: 0, bonus: 4 },
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

  addBonusPoint() {
    const point = this.#pointLists[this.#level]["bonus"];
    this.#bonusPoint += point;
  }
}
