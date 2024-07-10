import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import { TargetsFactory } from "./targets_factory.js";
import { GameState } from "./game_state.js";
import { GameScreen } from "./game_screen.js";
import { easyWords, normalWords, hardWords } from "./word.js";

export class Game {
  #targetsFactory;
  #gameState;
  #soundPlayer;

  constructor(level) {
    const wordList = this.#setWordList(level);
    const endTimeList = this.#setEndTimeList(level);
    const pointList = this.#setPointList(level);
    this.#targetsFactory = new TargetsFactory(wordList, endTimeList);
    const targets = this.#targetsFactory.generate();
    this.#gameState = new GameState(wordList, endTimeList, pointList, targets);
    const require = createRequire(import.meta.url);
    this.#soundPlayer = require("play-sound")();
  }

  async play() {
    await this.#startTyping();
    this.#winGameIfScoreOver();
    return this.#gameState;
  }

  #setWordList(level) {
    const wordLists = {
      veryEasy: easyWords,
      easy: easyWords,
      normal: normalWords,
      hard: hardWords,
      veryHard: hardWords,
    };

    return wordLists[level];
  }

  #setEndTimeList(level) {
    const endTimeLists = {
      veryEasy: { max: 12000, min: 9000 },
      easy: { max: 10000, min: 7000 },
      normal: { max: 8000, min: 5000 },
      hard: { max: 8000, min: 5000 },
      veryHard: { max: 7000, min: 4000 },
    };

    return endTimeLists[level];
  }

  #setPointList(level) {
    const pointLists = {
      veryEasy: { normal: 2, bonus: 4 },
      easy: { normal: 1, bonus: 3 },
      normal: { normal: 1, bonus: 2 },
      hard: { normal: 0, bonus: 1.5 },
      veryHard: { normal: 0, bonus: 1 },
    };

    return pointLists[level];
  }

  async #startTyping() {
    try {
      await Promise.all([
        this.#updateTargetsAndOutputPlayScreen(),
        this.#acceptUserInputAndToScore(),
      ]);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        throw error;
      }
    }
  }

  #updateTargetsAndOutputPlayScreen() {
    const delay = 50;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        this.#gameState.updateTargets();
        this.#outputPlayScreen();
        this.#endIntervalIfTimeOver(interval, resolve);
      }, delay);
    });
  }

  #outputPlayScreen() {
    const gameScreen = new GameScreen(this.#gameState);
    const playScreen = gameScreen.buildPlayScreen();
    console.clear();
    console.log(playScreen);
  }

  #endIntervalIfTimeOver(interval, resolve) {
    if (Date.now() > this.#gameState.endTime) {
      clearInterval(interval);
      resolve();
    }
  }

  #acceptUserInputAndToScore() {
    process.stdin.setRawMode(true);
    process.stdin.setEncoding("utf8");
    process.stdin.resume();

    return new Promise((resolve, reject) => {
      this.#endUserInputIfTimeOut(resolve);

      process.stdin.on("data", (char) => {
        if (char === "\u0003") {
          process.exit();
        } else {
          this.#toScoreAndPlaySoundAndUpdateGameState(char);
        }
      });

      process.stdin.on("error", () => {
        reject(new Error("入力中にエラーが発生しました。"));
        process.stdin.pause();
      });
    });
  }

  #endUserInputIfTimeOut(resolve) {
    setTimeout(() => {
      process.stdin.pause();
      resolve();
    }, this.#gameState.playTime);
  }

  #toScoreAndPlaySoundAndUpdateGameState(char) {
    const hitCheckString = this.#gameState.hitString.concat(char);
    const isHitWord = this.#gameState.judgeTargetWords(hitCheckString);
    const isHitString = this.#gameState.judgeTargetStrings(
      hitCheckString,
      this.#gameState.consecutiveHitCount,
    );

    if (isHitWord) {
      this.#handleHitWord(hitCheckString);
    } else if (isHitString) {
      this.#handleHitString(char);
    } else {
      this.#handleMiss();
    }
  }

  #handleHitWord(word) {
    const soundPath = this.#searchSoundPath("hit.mp3");
    this.#gameState.addBonusPoint(word);
    this.#soundPlayer.play(soundPath);
    this.#gameState.addHitWords(word);
    this.#resetHitCountAndHitChars();
  }

  #handleHitString(char) {
    const soundPath = this.#searchSoundPath("hit.mp3");
    this.#gameState.addNormalPoint();
    this.#soundPlayer.play(soundPath);
    this.#addHitCountAndHitChars(char);
  }

  #handleMiss() {
    const soundPath = this.#searchSoundPath("miss.mp3");
    this.#soundPlayer.play(soundPath);
    this.#resetHitCountAndHitChars();
  }

  #resetHitCountAndHitChars() {
    this.#gameState.resetConsecutiveHitCount();
    this.#gameState.resetConsecutiveHitChars();
  }

  #addHitCountAndHitChars(char) {
    this.#gameState.addConsecutiveHitCount();
    this.#gameState.addConsecutiveHitChars(char);
  }

  #winGameIfScoreOver() {
    if (this.#gameState.score > this.#gameState.scoreNeededToWin) {
      this.#gameState.winGame();
    }
  }

  #searchSoundPath(soundName) {
    const filePath = fileURLToPath(import.meta.url);
    const dirPath = path.dirname(filePath);
    return path.join(dirPath, soundName);
  }
}
