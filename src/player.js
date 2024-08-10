import { Gameboard } from "../src/gameboard.js";

export const Player = (type) => {
  const gameBoard = Gameboard();
  return { type, gameBoard };
};
