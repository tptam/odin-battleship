import Load from "./images/loading.svg";
import Win from "./images/ship.svg";
import Lose from "./images/drown.svg";

let content;
let message;
let enemyBoard;
let playerBoard;
let endTurnButton;
let modal;
let playAgainButton;

function render(json) {
  content = document.querySelector("#content");
  content.textContent = "";
  message = document.createElement("div");
  message.className = "message";
  message.textContent = JSON.parse(json).message;
  const enemyWrapper = document.createElement("div");
  enemyWrapper.className = "enemy-wrapper";
  const enemyTitle = document.createElement("h2");
  enemyTitle.textContent = "Enemy Zone";
  enemyWrapper.appendChild(enemyTitle);
  enemyBoard = document.createElement("div");
  enemyBoard.className = "board";
  enemyWrapper.appendChild(enemyBoard);

  const playerWrapper = document.createElement("div");
  playerWrapper.className = "player-wrapper";
  const playerTitle = document.createElement("h2");
  playerTitle.textContent = "Your Zone";
  playerWrapper.appendChild(playerTitle);
  playerBoard = document.createElement("div");
  playerBoard.className = "board";
  playerWrapper.appendChild(playerBoard);

  content.appendChild(message);
  content.appendChild(enemyWrapper);
  content.appendChild(playerWrapper);

  createBoards(json);
}

function bindClickCell(handler) {
  enemyBoard.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell")) {
      return;
    }
    const x = e.target.getAttribute("data-x");
    const y = e.target.getAttribute("data-y");
    handler(x, y);
  });
}

function createBoards(json) {
  // Enemy board
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("button");
      cell.appendChild(document.createElement("img"));
      cell.classList.add("cell");
      cell.setAttribute("data-x", x);
      cell.setAttribute("data-y", y);
      enemyBoard.appendChild(cell);
    }
  }
  // Player board
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");
      cell.appendChild(document.createElement("img"));
      cell.classList.add("cell");
      cell.setAttribute("data-x", x);
      cell.setAttribute("data-y", y);
      playerBoard.appendChild(cell);
    }
  }
  updatePlayerBoard(json);
  updateEnemyBoard(json);
}

function updateEnemyBoard(json) {
  const { enemy } = JSON.parse(json);
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = enemyBoard.querySelector(
        `.cell:nth-child(${y * 10 + x + 1})`
      );
      cell.className = "cell";
      cell.disabled =
        !enemy.clickable ||
        enemy.board[x][y].includes("hit") ||
        enemy.board[x][y].includes("miss");
      if (
        !enemy.unsunkShipsVisible &&
        enemy.board[x][y].includes("ship") &&
        !enemy.board[x][y].includes("sunk")
      ) {
        enemy.board[x][y]
          .filter((string) => string !== "ship")
          .forEach((string) => cell.classList.add(string));
      } else {
        enemy.board[x][y].forEach((string) => cell.classList.add(string));
      }
    }
  }
}

function updatePlayerBoard(json) {
  const { player } = JSON.parse(json);
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = playerBoard.querySelector(
        `.cell:nth-child(${y * 10 + x + 1})`
      );
      cell.className = "cell";
      if (
        !player.unsunkShipsVisible &&
        player.board[x][y].includes("ship") &&
        !player.board[x][y].includes("sunk")
      ) {
        player.board[x][y]
          .filter((string) => string !== "ship")
          .forEach((string) => cell.classList.add(string));
      } else {
        player.board[x][y].forEach((string) => cell.classList.add(string));
      }
    }
  }
}

function setMessage(string) {
  message.textContent = string;
}

function highlightCell(coord) {
  const cell = document.querySelector(
    `.cell[data-x="${coord.x}"][data-y="${coord.y}"]`
  );
  cell.classList.add("focus");
}

function showEndTurnButton() {
  endTurnButton = document.createElement("button");
  endTurnButton.classList.add("end-turn");
  endTurnButton.textContent = "End Turn";
  message.appendChild(endTurnButton);
}

function showThinkingIcon() {
  const icon = new Image();
  icon.src = Load;
  icon.className = "thinking";
  enemyBoard.appendChild(icon);
}

async function hideThinkingIcon(coord = null) {
  const diff = coord === null ? { x: 0, y: 0 } : getDiff(coord);
  const icon = document.querySelector(".thinking");
  if (coord !== null) {
    highlightCell(coord);
  }
  icon.style.setProperty("--diff-x", diff.x + "px");
  icon.style.setProperty("--diff-y", diff.y + "px");
  icon.classList.add("bye");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  icon.remove();
}

function hideEndTurnButton() {
  endTurnButton.remove();
}

function bindEndTurn(handler) {
  endTurnButton.addEventListener("click", handler);
}

function getDiff(coord) {
  const cellSize = document.querySelector(".cell").offsetWidth;
  const borderWidth = 2;
  return {
    x: (coord.x - 4.5) * (cellSize + borderWidth),
    y: (coord.y - 4.5) * (cellSize + borderWidth),
  };
}

function showPlayAgainButton() {
  const playAgainButton = document.createElement("button");
  playAgainButton.classList.add("play-again");
  playAgainButton.textContent = "Play Again";
  message.appendChild(playAgainButton);
}

function hidePlayAgainButton() {
  const playAgainButton = document.querySelector("message .play-again");
  playAgainButton.remove();
}

function showEndResult(name, type) {
  const modal = document.querySelector("dialog");
  modal.textContent = "";
  const img = new Image();
  const message = document.createElement("h1");
  const quitButton = document.createElement("button");
  const playAgainButton = document.createElement("button");
  img.src = type === "computer" ? Lose : Win;
  message.textContent = type === "computer" ? "Computer Wins" : "You Win";
  playAgainButton.classList.add("play-again");
  playAgainButton.textContent = "Play Again";
  quitButton.textContent = "Quit";

  playAgainButton.addEventListener("click", () => modal.close());
  quitButton.addEventListener("click", () => modal.close());

  modal.appendChild(img);
  modal.appendChild(message);
  modal.appendChild(quitButton);
  modal.appendChild(playAgainButton);
  modal.showModal();
}

function bindPlayAgain(handler) {
  const buttons = document.querySelectorAll("button.play-again");
  buttons.forEach((button) => button.addEventListener("click", handler));
}

export {
  render,
  bindClickCell,
  bindEndTurn,
  bindPlayAgain,
  updateEnemyBoard,
  updatePlayerBoard,
  showEndResult,
  setMessage,
  highlightCell,
  showEndTurnButton,
  hideEndTurnButton,
  showThinkingIcon,
  hideThinkingIcon,
  showPlayAgainButton,
  hidePlayAgainButton,
};
