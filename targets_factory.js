import { Target } from "./target.js";
import { Judgment } from "./judgment.js";
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
    const judgment = new Judgment(hitWords);

    targets.forEach((target) => {
      const timeManager = new TimeManager(target.endTime);
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
    const words = this.#getWords(targets);
    const judgment = new Judgment(hitWords);

    while (this.#isDuplicateWord(newTarget, words, judgment)) {
      newTarget = new Target(this.#level);
    }

    return newTarget;
  }

  #isDuplicateWord(newTarget, words, judgment) {
    const newWord = newTarget.word;
    const isSomeWord = this.#isSomeWord(newWord, words);
    const isHitWord = judgment.isHitWord(newWord);
    return isSomeWord || isHitWord;
  }

  #isSomeWord(newWord, words) {
    const newWords = new Set(words).add(newWord);
    return words.size === newWords.size;
  }

  #getWords(targets) {
    const words = [];

    targets.forEach((target) => {
      words.push(target.word);
    });

    return words;
  }
}
