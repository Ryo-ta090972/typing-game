#!/usr/bin/env node

import enquirer from "enquirer";
import { Game } from "./game.js";
import { GameScreen } from "./game_screen.js";

const { prompt } = enquirer;
const questions = [
  {
    type: "select",
    name: "gameLevel",
    message: "ゲームの難易度を選択してください。",
    choices: ["veryEasy", "easy", "normal", "hard", "veryHard"],
  },
];

async function main() {
  const answer = await prompt(questions);
  const game = new Game(answer.gameLevel);
  const gameResult = await game.play();
  const gameScreen = new GameScreen(gameResult);
  const endScreen = gameScreen.buildEndScreen();
  console.log(endScreen);
}

main();
