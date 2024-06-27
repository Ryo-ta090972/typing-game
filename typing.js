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

const round1 = new Game("easy");
const round1Score = await round1.play();
console.log("ゲーム終了");
console.log(round1Score);
