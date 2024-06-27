export class Judgment {
  #words;

  constructor(words) {
    this.#words = words;
  }

  isPerfectHit(shoot, hittingWord) {
    const shootingWord = hittingWord.concat(shoot);
    return this.#words.includes(shootingWord);
  }

  isHit(shoot, hittingWord, consecutiveHitCount) {
    const shootingWord = hittingWord.concat(shoot);
    const targetWords = this.#buildTargetWords(consecutiveHitCount);
    return targetWords.includes(shootingWord);
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
