export class GameScreen {
  #gameState;

  constructor(gameState) {
    this.#gameState = gameState;
  }

  buildPlayScreen() {
    const header = this.#buildHeader();
    const body = this.#buildBody();
    const playScreen = [header, body];
    return playScreen.join("\n");
  }

  buildEndScreen() {
    const gameClearScreen = [
      "ゲームクリア！",
      `あなたのスコアは ${this.#gameState.score} 点です。`,
    ];

    const gameOverScreen = [
      "ゲームオーバー！",
      `あなたのスコアは ${this.#gameState.score} 点です。`,
    ];

    return this.#gameState.isGameWon
      ? gameClearScreen.join("\n")
      : gameOverScreen.join("\n");
  }

  #buildHeader() {
    const header = [
      `ゲームクリアまであと ${this.#remainingPoint()} 点必要です。`,
      `スコア：${this.#gameState.score} 点`,
      `残り時間：${this.#remainingTime()} 秒`,
      "",
    ];

    return header.join("\n");
  }

  #buildBody() {
    const body = this.#gameState.targets.map((target) => {
      const regex = new RegExp(`^${this.#gameState.hitString}`);
      const remainingWord = target.word.replace(regex, "");
      return target.indent + remainingWord;
    });

    return body.join("\n\n");
  }

  #remainingPoint() {
    const remainingPoint =
      this.#gameState.scoreNeededToWin - this.#gameState.score;

    return remainingPoint > 0 ? remainingPoint : 0;
  }

  #remainingTime() {
    const remainingTime = Math.floor(
      (this.#gameState.endTime - Date.now()) / 1000,
    );

    return remainingTime > 0 ? remainingTime : 0;
  }
}
