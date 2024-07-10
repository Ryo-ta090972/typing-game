export class Score {
  #pointList;
  #normalPoint = 0;
  #bonusPoint = 0;

  constructor(pointList) {
    this.#pointList = pointList;
  }

  get totalPoint() {
    return this.#normalPoint + this.#bonusPoint;
  }

  addNormalPoint() {
    const point = this.#pointList["normal"];
    this.#normalPoint += point;
  }

  addBonusPoint(word) {
    const bonusRate = this.#pointList["bonus"];
    this.#bonusPoint += word.length * bonusRate;
  }
}
