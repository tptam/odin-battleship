import { Gameboard } from "../src/gameboard.js";

export const Player = (type, name) => {
  const gameBoard = Gameboard();
  return { type, gameBoard, name };
};
