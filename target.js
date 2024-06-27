import {
  veryEasyWords,
  easyWords,
  normalWords,
  hardWords,
  veryHardWords,
} from "./word.js";

export class Target {
  #word;
  #endingTime;
  #wordLists = {
    veryEasy: veryEasyWords,
    easy: easyWords,
    normal: normalWords,
    hard: hardWords,
    veryHard: veryHardWords,
  };
  #timeLists = {
    veryEasy: { max: 12000, min: 9000 },
    easy: { max: 10000, min: 7000 },
    normal: { max: 8000, min: 5000 },
    hard: { max: 6000, min: 3000 },
    veryHard: { max: 4000, min: 2000 },
  };

  constructor(level) {
    this.#word = this.#setWord(level);
    this.#endingTime = this.#setEndingTime(level);
  }

  get word() {
    return this.#word;
  }

  get endingTime() {
    return this.#endingTime;
  }

  #setWord(level) {
    const words = this.#wordLists[level];
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  #setEndingTime(level) {
    const maxTime = this.#timeLists[level]["max"];
    const minTime = this.#timeLists[level]["min"];
    return Date.now() + this.#addRandomTime(maxTime, minTime);
  }

  #addRandomTime(maxTime, minTime) {
    return Math.floor(Math.random() * (maxTime - minTime) + minTime);
  }
}
