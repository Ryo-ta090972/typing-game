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
    veryEasy: { max: 12, min: 9 },
    easy: { max: 10, min: 7 },
    normal: { max: 8, min: 5 },
    hard: { max: 6, min: 3 },
    veryHard: { max: 4, min: 2 },
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

    const time = this.#getTime(maxTime, minTime);
    return Date.now() / 1000 + time;
  }

  #getTime(max, min) {
    return Math.random() * (max - min) + min;
  }
}
