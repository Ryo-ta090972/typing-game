import { Judgment } from "./judgment.js";
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

  update(targets, hitWords) {
    const newTargets = [];

    targets.forEach((target) => {
      const timeManager = new TimeManager(target.endingTime);
      const judgment = new Judgment(hitWords);
      const isHitWord = judgment.isHitWord(target.word);
      const newTarget = this.#createNewTarget({
        targets,
        hitWords,
      });

      if (timeManager.isTimeOver() || isHitWord) {
        newTargets.push(newTarget);
      } else {
        newTargets.push(target);
      }
    });
    return newTargets;
  }

  #createNewTarget({ targets, hitWords = [] }) {
    let newTarget = new Target(this.#level);

    while (this.#isSomeWordOrHitWord(newTarget, targets, hitWords)) {
      newTarget = new Target(this.#level);
    }

    return newTarget;
  }

  #isSomeWordOrHitWord(newTarget, targets, hitWords) {
    const newWord = newTarget.word;
    const judgment = new Judgment(hitWords);
    const isSomeWord = this.#isSomeWord(newWord, targets);
    const isHitWord = judgment.isHitWord(newWord);

    return isSomeWord || isHitWord;
  }

  #isSomeWord(target, targets) {
    const word = target.word;
    const targetWords = this.#getWords(targets);
    const uniqueWords = new Set(targetWords);
    return uniqueWords.size === uniqueWords.add(word).size;
  }

  #getWords(targets) {
    const words = [];

    targets.forEach((target) => {
      words.push(target.word);
    });
    return words;
  }
}
