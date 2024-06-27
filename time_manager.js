export class TimeManager {
  #time;

  constructor(time) {
    this.#time = time;
  }

  isTimeOver() {
    return Date.now() > this.#time;
  }
}
