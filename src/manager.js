import { Gameboard } from "../src/gameboard.js";
import { Ship } from "../src/ship.js";
import { Player } from "../src/player.js";

let player1;
let player2;

function startGame() {
  player1 = new Player("real");
  player2 = new Player("computer");
}
