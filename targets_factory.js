import { Target } from "./target.js";
import { TimeManager } from "./time_manager.js";

export class TargetsFactory {
  #level;

  constructor(level) {
    this.#level = level;
  }

  generate() {
    const targets = [new Target(this.#level)];

    while (targets.length < 5) {
      const newTarget = this.#createNewTarget({ targets });
      targets.push(newTarget);
    }
    return targets;
  }

  update(targets, perfectHitWords) {
    const newTargets = [];

    targets.forEach((target) => {
      const isPerfectHitWord = this.#isPerfectHitWord(target, perfectHitWords);
      const timeManager = new TimeManager(target.endingTime);
      const newTarget = this.#createNewTarget({
        targets,
        perfectHitWords,
      });

      if (timeManager.isTimeOver() || isPerfectHitWord) {
        newTargets.push(newTarget);
      } else {
        newTargets.push(target);
      }
    });
    return newTargets;
  }

  #createNewTarget({ targets, perfectHitWords = [] }) {
    let newTarget = new Target(this.#level);

    while (
      this.#isSomeWord(newTarget, targets) ||
      this.#isPerfectHitWord(newTarget, perfectHitWords)
    ) {
      newTarget = new Target(this.#level);
    }

    return newTarget;
  }

  #isSomeWord(newTarget, targets) {
    const newWord = newTarget.word;
    const targetWords = this.#getWords(targets);
    const uniqueWords = new Set(targetWords);
    return uniqueWords.size === uniqueWords.add(newWord).size;
  }

  #isPerfectHitWord(target, perfectHitWords) {
    const word = target.word;
    return perfectHitWords.includes(word);
  }

  #getWords(targets) {
    const words = [];

    targets.forEach((target) => {
      words.push(target.word);
    });
    return words;
  }
}
