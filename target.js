export class Target {
  #word;
  #endTime;
  #indent;
  #maxIndent = 100;

  constructor(wordList, endTimeList) {
    this.#word = this.#setWord(wordList);
    this.#endTime = this.#setEndTime(endTimeList);
    this.#indent = this.#buildRandomIndent();
  }

  get word() {
    return this.#word;
  }

  get endTime() {
    return this.#endTime;
  }

  get indent() {
    return this.#indent;
  }

  buildString(consecutiveHitCount) {
    const chars = [...this.#word];
    return chars.slice(0, consecutiveHitCount + 1).join("");
  }

  #setWord(wordList) {
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  }

  #setEndTime(endTimeList) {
    const maxTime = endTimeList["max"];
    const minTime = endTimeList["min"];
    return Date.now() + this.#addRandomTime(maxTime, minTime);
  }

  #addRandomTime(maxTime, minTime) {
    return Math.floor(Math.random() * (maxTime - minTime) + minTime);
  }

  #buildRandomIndent() {
    const randomInt = Math.floor(Math.random() * this.#maxIndent);
    return " ".repeat(randomInt);
  }
}
