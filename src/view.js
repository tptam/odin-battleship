let content;
let message;
let enemyBoard;
let playerBoard;
let endTurnButton;

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
      if (
        !enemy.clickable ||
        enemy.board[x][y].includes("hit") ||
        enemy.board[x][y].includes("miss")
      ) {
        cell.disabled = true;
      }
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
        !player.board[x][y].includes("hit")
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

function showEndTurnButton() {
  endTurnButton = document.createElement("button");
  endTurnButton.classList.add("end-turn");
  endTurnButton.textContent = "End Turn";
  message.appendChild(endTurnButton);
}

function bindEndTurn(handler) {
  endTurnButton.addEventListener("click", handler);
}

export {
  render,
  bindClickCell,
  updateEnemyBoard,
  updatePlayerBoard,
  setMessage,
  showEndTurnButton,
  bindEndTurn,
};
