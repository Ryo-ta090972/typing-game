export class TimeManager {
  #time;

  constructor(time) {
    this.#time = time;
  }

  isTimeOver() {
    return Date.now() / 1000 > this.#time;
  }
}
