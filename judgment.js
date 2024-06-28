export class Judgment {
  #words;

  constructor(words) {
    this.#words = words;
  }

  isHitWord(word) {
    return this.#words.includes(word);
  }

  isHitString(string, consecutiveHitCount) {
    const targetStrings = this.#buildTargetStrings(consecutiveHitCount);
    return targetStrings.includes(string);
  }

  #buildTargetStrings(consecutiveHitCount) {
    const targetStrings = [];

    this.#words.forEach((word) => {
      const chars = [...word];
      const targetString = chars.slice(0, consecutiveHitCount + 1).join("");
      targetStrings.push(targetString);
    });
    return targetStrings;
  }
}
