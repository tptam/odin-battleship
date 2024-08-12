// import { Gameboard } from "../src/gameboard.js";
// import { Ship } from "../src/ship.js";
import { Player } from "../src/player.js";

import * as View from "./view.js";

let player1;
let player2;

function startGame() {
  player1 = Player("real");
  player2 = Player("computer");
  player1.shipsMap = [...Array(10)].map(() => Array(10).fill(null));
  player2.shipsMap = [...Array(10)].map(() => Array(10).fill(null));
  placeRandomShips(player1);
  placeRandomShips(player2);
  View.render(getJson(player1, player2, "Your turn"));
}

function getJson(player, enemy, message) {
  const playerData = {
    board: getBoardData(player),
  };
  const enemyData = {
    board: getBoardData(enemy),
  };
  return JSON.stringify({
    player: playerData,
    enemy: enemyData,
    message,
  });
}

function getBoardData(player) {
  const board = player.gameBoard;
  const shipsMap = player.shipsMap;
  const boardData = [];
  for (let i = 0; i < 10; i++) {
    const row = [];
    for (let j = 0; j < 10; j++) {
      row.push(new Array());
    }
    boardData.push(row);
  }

  board.missedAttacks.forEach(({ x, y }) => {
    boardData[x][y].push("missed");
  });
  board.hits.forEach(({ x, y }) => {
    boardData[x][y].push("hit");
  });

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (shipsMap[x][y] === null) {
        continue;
      }
      boardData[x][y].push("ship");
      boardData[x][y].push(shipsMap[x][y].direction);
      boardData[x][y].push(shipsMap[x][y].part);
      if (board.getShipAt(x, y).isSunk()) {
        boardData[x][y].push("sunk");
      }
    }
  }
  return boardData;
}

function placeRandomShips(player) {
  const board = player.gameBoard;
  const shipsMap = player.shipsMap;
  const shipLengths = [5, 4, 3, 2, 1];
  shipLengths.forEach((length) => {
    while (true) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const direction = Math.random() < 0.5 ? "vertical" : "horizontal";
      if (board.isPlaceable(x, y, length, direction)) {
        board.placeShip(x, y, length, direction);
        addShipToMap(x, y, length, direction, shipsMap);
        break;
      }
    }
  });
}

function addShipToMap(x, y, length, direction, shipsMap) {
  for (let i = 0; i < length; i++) {
    const mapX = direction === "vertical" ? x : x + i;
    const mapY = direction === "vertical" ? y + i : y;
    let part;
    if (length === 1) {
      part = "all";
    } else if (i === 0) {
      part = "fore";
    } else if (i === length - 1) {
      part = "aft";
    } else {
      part = "middle";
    }
    shipsMap[mapX][mapY] = { direction, part };
  }
}

export { startGame };
