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
      const newTarget = this.#createNewTarget(targets);
      targets.push(newTarget);
    }
    return targets;
  }

  exchange(targets) {
    const newTargets = [];

    targets.forEach((target) => {
      const targetTimeManager = new TimeManager(target);
      const isTimeOver = targetTimeManager.isTimeOver();
      const newTarget = this.#createNewTarget(targets);

      if (isTimeOver) {
        newTargets.push(newTarget);
      } else {
        newTargets.push(target);
      }
    });
    return newTargets;
  }

  #createNewTarget(targets) {
    let newTarget = new Target(this.#level);

    while (this.#isSomeWord(newTarget, targets)) {
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

  #getWords(targets) {
    const words = [];

    targets.forEach((target) => {
      words.push(target.word);
    });
    return words;
  }
}
