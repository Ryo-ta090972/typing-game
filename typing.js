#!/usr/bin/env node

// ゲームの難易度を設定する
// import enquirer from "enquirer";
// const { prompt } = enquirer;

// const questions = [
//   {
//     type: "select",
//     name: "level",
//     message: "ゲームの難易度を選択してください。",
//     choices: ["easy", "normal", "hard", "very hard"],
//   },
//   {
//     type: "select",
//     name: "start",
//     message: "ゲームを開始しますか？",
//     choices: ["start!", "back"],
//   },
// ];

// await prompt(questions);

import { Game } from "./game.js";

const game = new Game("easy");
game.play();
