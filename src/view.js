let content;
let message;
let enemyBoard;
let playerBoard;

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

  updateBoards(json);
}

function updateBoards(json) {
  const { player, enemy } = JSON.parse(json);

  // Enemy board
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-x", x);
      cell.setAttribute("data-y", y);
      enemy.board[x][y].forEach((string) => cell.classList.add(string));
      enemyBoard.appendChild(cell);
    }
  }
  // Player board
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-x", x);
      cell.setAttribute("data-y", y);
      player.board[x][y].forEach((string) => cell.classList.add(string));
      playerBoard.appendChild(cell);
    }
  }
}

export { render, updateBoards };
