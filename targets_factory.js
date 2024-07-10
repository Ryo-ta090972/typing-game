import { Target } from "./target.js";

export class TargetsFactory {
  #level;

  constructor(level) {
    this.#level = level;
  }

  generate() {
    const targets = [new Target(this.#level)];

    while (targets.length < 5) {
      const newTarget = this.createNewTarget({ targets });
      targets.push(newTarget);
    }

    return targets;
  }

  createNewTarget({ targets, hitWords = [] }) {
    let newTarget = new Target(this.#level);
    const words = targets.map((target) => target.word);

    while (this.#isDuplicateWord(newTarget, words, hitWords)) {
      newTarget = new Target(this.#level);
    }

    return newTarget;
  }

  #isDuplicateWord(newTarget, words, hitWords) {
    const newWord = newTarget.word;
    const isSomeWord = this.#isSomeWord(newWord, words);
    const isHitWord = hitWords.includes(newWord);
    return isSomeWord || isHitWord;
  }

  #isSomeWord(newWord, words) {
    const uniqueWords = new Set(words);
    uniqueWords.add(newWord);
    return words.length === uniqueWords.size;
  }
}
