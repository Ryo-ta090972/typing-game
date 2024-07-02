#!/usr/bin/env node

import enquirer from "enquirer";
import { Game } from "./game.js";

const { prompt } = enquirer;
const questions = [
  {
    type: "select",
    name: "gameLevel",
    message: "ゲームの難易度を選択してください。",
    choices: ["easy", "normal", "hard", "very hard"],
  },
];

function outputGameResult(result) {
  console.clear();

  if (result.isGameWon) {
    console.log("素晴らしい！ゲームクリア！");
    console.log(`あなたの得点は${result.score}です！`);
  } else {
    console.log("ゲームオーバー。もっと頑張りましょう！");
    console.log(`あなたの得点は${result.score}です。`);
  }
}

async function main() {
  const answer = await prompt(questions);
  const game = new Game(answer.gameLevel);
  const gameResult = await game.play();
  outputGameResult(gameResult);
}

main();
