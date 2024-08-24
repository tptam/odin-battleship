import { Player } from "../src/player.js";
import * as View from "./view.js";
import { render as renderSetup, bindClickFinishSetup } from "./setup-view.js";

let currentPlayer;
let currentEnemy;

function init(player1 = "You", player2 = "Computer") {
  currentPlayer = Player("real", player1);
  currentEnemy = Player("computer", player2);

  currentPlayer.shipsMap = [...Array(10)].map(() => Array(10).fill(null));
  currentEnemy.shipsMap = [...Array(10)].map(() => Array(10).fill(null));

  //Player setup
  renderSetup(currentPlayer.name);
  bindClickFinishSetup(onFinishSetup);

  //Computer setup
  placeRandomShips(currentEnemy);
}

function startGame() {
  currentPlayer.gameBoard.pubsub.subscribe("receive_attack", (data) => {
    console.log("received attack - player");
    onReceiveAttack(data);
  });
  currentEnemy.gameBoard.pubsub.subscribe("receive_attack", (data) => {
    onReceiveAttack(data);
  });
  const playerData = getPlayerData(currentPlayer, true);
  const enemyData = getEnemyData(currentEnemy, true, true); //visible for testing
  View.render(
    JSON.stringify({
      player: playerData,
      enemy: enemyData,
      playerName: currentPlayer.name,
      message: "",
    })
  );
  View.bindClickCell(currentEnemy.gameBoard.receiveAttack);
}

function onReceiveAttack(coord) {
  const enemyData = getEnemyData(currentEnemy, isComputerTurn(), false);
  View.updateEnemyBoard(JSON.stringify({ enemy: enemyData }));
  View.highlightCell(coord);
  let result = "miss";
  if (enemyData.board[coord.x][coord.y].includes("sunk")) {
    result = "sunk a ship";
  } else if (enemyData.board[coord.x][coord.y].includes("hit")) {
    result = "hit";
  }
  View.setMessage(`Attacked (${coord.x},${coord.y}): ${result}`);
  if (currentEnemy.gameBoard.allShipsSunk()) {
    enemyData.clickable = false;
    View.updateEnemyBoard(JSON.stringify({ enemy: enemyData }));
    View.showPlayAgainButton();
    View.showEndResult(currentPlayer.name, currentPlayer.type);
    View.bindPlayAgain(onPlayAgain);
    return;
  }
  View.showEndTurnButton();
  View.bindEndTurn(onEndTurn);
}

function onPlayAgain() {
  const player1 = isComputerTurn() ? currentEnemy.name : currentPlayer.name;
  init(player1, "Computer");
}

function onEndTurn() {
  switchTurns();
  const enemyData = getEnemyData(currentEnemy, true, !isComputerTurn());
  const playerData = getPlayerData(currentPlayer, !isComputerTurn());
  View.updateEnemyBoard(JSON.stringify({ enemy: enemyData }));
  View.updatePlayerBoard(JSON.stringify({ player: playerData }));
  View.hideEndTurnButton();
  View.updatePlayerName(currentPlayer.name);
  View.setMessage("");
  if (isComputerTurn()) {
    playComputer();
  }
}

function isComputerTurn() {
  return currentPlayer.type === "computer";
}

async function playComputer() {
  View.showThinkingIcon();
  await new Promise((resolve) => setTimeout(resolve, 500));
  const coord = getRandomAttackCoord();
  await View.hideThinkingIcon(coord);
  await new Promise((resolve) => setTimeout(resolve, 100));
  currentEnemy.gameBoard.receiveAttack(coord.x, coord.y);
}

function getRandomAttackCoord() {
  const noAttacks = currentEnemy.gameBoard.noAttacks;
  const coord = noAttacks.at(Math.floor(Math.random() * noAttacks.length));
  return coord;
}

function switchTurns() {
  [currentPlayer, currentEnemy] = [currentEnemy, currentPlayer];
}

function getPlayerData(player, unsunkShipsVisible) {
  return {
    board: getBoardData(player),
    unsunkShipsVisible,
  };
}

function getEnemyData(enemy, unsunkShipsVisible, clickable) {
  return {
    board: getBoardData(enemy),
    unsunkShipsVisible,
    clickable,
  };
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
    boardData[x][y].push("miss");
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

function onFinishSetup(ships, playerName) {
  console.log(ships);
  if (playerName === "") {
    alert("No player name is submitted.");
    return;
  } else {
    currentPlayer.name = playerName;
  }
  const board = currentPlayer.gameBoard;
  const shipsMap = currentPlayer.shipsMap;
  ships.forEach(({ x, y, length, direction }) => {
    if (board.isPlaceable(x, y, length, direction)) {
      board.placeShip(x, y, length, direction);
      addShipToMap(x, y, length, direction, shipsMap);
    }
  });
  startGame();
}

export { init, startGame };
