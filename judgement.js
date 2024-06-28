export class Judgment {
  #words;

  constructor(words) {
    this.#words = words;
  }

  isPerfectHit(word) {
    return this.#words.includes(word);
  }

  isHit(word, consecutiveHitCount) {
    const targetWords = this.#buildTargetWords(consecutiveHitCount);
    return targetWords.includes(word);
  }

  #buildTargetWords(consecutiveHitCount) {
    const targetWords = [];

    this.#words.forEach((word) => {
      const chars = [...word];
      const targetWord = chars.slice(0, consecutiveHitCount + 1).join("");
      targetWords.push(targetWord);
    });
    return targetWords;
  }
}
