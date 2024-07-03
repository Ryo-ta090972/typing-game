export class GameScreen {
  #gameState;

  constructor(gameState) {
    this.#gameState = gameState;
  }

  buildPlayScreen() {
    const playScreen = [];
    const header = this.#buildHeader();
    const body = this.#buildBody();

    playScreen.push(header, body);
    return playScreen.join("\n");
  }

  buildEndScreen() {
    const endScreen = [];

    if (this.#gameState.isGameWon) {
      endScreen.push(
        "ゲームクリア！",
        `あなたのスコアは ${this.#gameState.score} 点です。`,
      );
    } else {
      endScreen.push(
        "ゲームオーバー！",
        `あなたのスコアは ${this.#gameState.score} 点です。`,
      );
    }

    return endScreen.join("\n");
  }

  #buildHeader() {
    const header = [];
    header.push(
      `ゲームクリアまであと ${this.#remainingPoint()} 点必要です。`,
      `スコア：${this.#gameState.score} 点`,
      `残り時間：${this.#remainingTime()} 秒`,
      "",
    );

    return header.join("\n");
  }

  #buildBody() {
    const body = [];

    this.#gameState.targets.forEach((target) => {
      const regex = new RegExp(`^${this.#gameState.hitString}`);
      const remainingWord = target.word.replace(regex, "");
      const word = target.indent + remainingWord;
      body.push(word, "");
    });

    return body.join("\n");
  }

  #remainingPoint() {
    const remainingPoint =
      this.#gameState.scoreNeededToWin - this.#gameState.score;

    if (remainingPoint > 0) {
      return remainingPoint;
    } else {
      return 0;
    }
  }

  #remainingTime() {
    const remainingTime = Math.floor(
      (this.#gameState.endTime - Date.now()) / 1000,
    );

    if (remainingTime > 0) {
      return remainingTime;
    } else {
      return 0;
    }
  }
}
