import { easyWords, normalWords, hardWords } from "./word.js";

export class Target {
  #word;
  #endTime;
  #indent;
  #wordLists = {
    veryEasy: easyWords,
    easy: easyWords,
    normal: normalWords,
    hard: hardWords,
    veryHard: hardWords,
  };
  #timeLists = {
    veryEasy: { max: 12000, min: 9000 },
    easy: { max: 10000, min: 7000 },
    normal: { max: 8000, min: 5000 },
    hard: { max: 8000, min: 5000 },
    veryHard: { max: 7000, min: 4000 },
  };
  #maxIndent = 100;

  constructor(level) {
    this.#word = this.#setWord(level);
    this.#endTime = this.#setEndTime(level);
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

  #setWord(level) {
    const words = this.#wordLists[level];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  #setEndTime(level) {
    const maxTime = this.#timeLists[level]["max"];
    const minTime = this.#timeLists[level]["min"];
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
