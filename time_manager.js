export class TimeManager {
  #target;

  constructor(target) {
    this.#target = target;
  }

  isTimeOver() {
    return Date.now() / 1000 > this.#target.endingTime;
  }
}
