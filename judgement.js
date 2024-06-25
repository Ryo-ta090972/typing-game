export class Judgment {
  #words;

  constructor(words) {
    this.#words = words;
  }

  isHit(shoot, hits, consecutiveHitCount) {
    const hittingWords = [...hits];
    hittingWords.push(shoot);
    const hittingWord = hittingWords.join("");
    const targetWords = this.#buildTargetWords(consecutiveHitCount);
    return targetWords.includes(hittingWord);
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
