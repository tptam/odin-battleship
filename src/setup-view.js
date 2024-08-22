import Pencil from "./images/pencil.svg";

let content;
let name;
let message;
let board;
let dock;
let finishSetupButton;

const placedShips = [];
let draggedShip = null;
let offsetX, offsetY;

function render(playerName = "You") {
  content = document.querySelector("#content");
  content.textContent = "";

  const setupWrapper = document.createElement("div");
  setupWrapper.className = "setup-wrapper";
  content.appendChild(setupWrapper);

  const instruction = document.createElement("div");
  instruction.className = "instruction";
  setupWrapper.appendChild(instruction);

  name = document.createElement("input");
  name.setAttribute("type", "text");
  name.value = playerName;
  name.id = "player-name";
  name.maxLength = 10;
  name.addEventListener("blur", () => {
    if (name.value === "") {
      name.value = playerName;
    }
  });

  const editButton = document.createElement("button");
  const editIcon = new Image();
  editButton.id = "edit-button";
  editButton.ariaLabel = "edit button";
  editIcon.src = Pencil;
  editButton.appendChild(editIcon);
  editButton.addEventListener("click", (e) => {
    e.preventDefault();
    name.focus();
  });

  const nameForm = document.createElement("form");
  nameForm.classList.add("name-form");
  nameForm.appendChild(name);
  nameForm.appendChild(editButton);
  instruction.appendChild(nameForm);

  message = document.createElement("div");
  message.className = "message setup";
  message.innerHTML =
    "Drag and drop your ships onto the map.<br>Click to rotate.";
  instruction.appendChild(message);

  const playArea = document.createElement("div");
  playArea.className = "play-area";
  setupWrapper.appendChild(playArea);

  board = document.createElement("div");
  board.className = "board";
  dock = document.createElement("div");
  dock.className = "dock";

  playArea.appendChild(board);
  playArea.appendChild(dock);

  placedShips.splice(0, placedShips.length);

  createBoard();
  createShips();
  createDock();

  finishSetupButton = document.createElement("button");
  finishSetupButton.classList.add("finish-setup");
  finishSetupButton.textContent = "Finish Setup";
}

function createBoard() {
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("data-x", i % 10);
    cell.setAttribute("data-y", Math.floor(i / 10));
    board.append(cell);
  }
  board.addEventListener("dragover", (e) => e.preventDefault());
  board.addEventListener("drop", onDropBoard);
}

function createShips() {
  console.log(123);
  const cellSize = document.querySelector(".cell").offsetWidth - 2;
  //   const borderWidth = 2;
  for (let i = 1; i <= 5; i++) {
    const shipWrapper = document.createElement("div");
    shipWrapper.classList.add("ship-wrapper", "vertical");
    shipWrapper.setAttribute("data-length", i);
    shipWrapper.setAttribute("data-width", 1);
    shipWrapper.setAttribute("data-height", i);
    for (let j = 0; j < i; j++) {
      const ship = document.createElement("div");
      ship.style.width = `${cellSize}px`;
      ship.style.height = `${cellSize}px`;
      ship.classList.add("ship", "vertical");
      if (j === 0 && i === 1) {
        ship.classList.add("all");
      } else if (j === 0) {
        ship.classList.add("fore");
      } else if (j === i - 1) {
        ship.classList.add("aft");
      }
      shipWrapper.appendChild(ship);
    }
    shipWrapper.setAttribute("draggable", "true");
    shipWrapper.addEventListener("click", () => {
      switchDirection(shipWrapper);
    });
    shipWrapper.addEventListener("dragstart", onDragStart);
    dock.appendChild(shipWrapper);
  }
}

function createDock() {
  dock.addEventListener("dragover", (e) => e.preventDefault());
  dock.addEventListener("drop", onDropDock);
}

function switchDirection(shipWrapper) {
  if (shipWrapper.parentElement === board) {
    draggedShip = shipWrapper;
    const placeable = isPlaceable(
      Number(shipWrapper.dataset.x),
      Number(shipWrapper.dataset.y),
      Number(shipWrapper.dataset.height),
      Number(shipWrapper.dataset.width)
    );
    draggedShip = null;
    if (!placeable) {
      alert("Ships should be on the board without overlap.");
      return;
    }
  }
  shipWrapper.classList.toggle("horizontal");
  shipWrapper.classList.toggle("vertical");
  shipWrapper.querySelectorAll(".ship").forEach((ship) => {
    ship.classList.toggle("horizontal");
    ship.classList.toggle("vertical");
  });
  const oldWidth = shipWrapper.dataset.width;
  shipWrapper.setAttribute("data-width", shipWrapper.dataset.height);
  shipWrapper.setAttribute("data-height", oldWidth);
}

function onDragStart(e) {
  draggedShip = e.target;
  const shipRect = draggedShip.getBoundingClientRect();
  offsetX = e.clientX - shipRect.left;
  offsetY = e.clientY - shipRect.top;
}

function onDropBoard(e) {
  e.preventDefault();
  if (!draggedShip) {
    return;
  }
  const boardRect = board.getBoundingClientRect();
  const x = Math.round((e.clientX - offsetX - boardRect.left) / 45);
  const y = Math.round((e.clientY - offsetY - boardRect.top) / 45);

  if (
    !isPlaceable(
      x,
      y,
      Number(draggedShip.dataset.width),
      Number(draggedShip.dataset.height)
    )
  ) {
    alert("Ships should be on the board without overlap.");
    return;
  }

  board.appendChild(draggedShip);
  draggedShip.style.left = `${45 * x + 1}px`;
  draggedShip.style.top = `${45 * y + 1}px`;
  draggedShip.setAttribute("data-x", x);
  draggedShip.setAttribute("data-y", y);
  if (!placedShips.includes(draggedShip)) {
    placedShips.push(draggedShip);
  }
  draggedShip = null;
  updateFinishSetupButton();
}

function onDropDock(e) {
  e.preventDefault();
  if (!draggedShip) {
    return;
  }
  if (draggedShip.parentElement === board) {
    const index = placedShips.indexOf(draggedShip);
    placedShips.splice(index, 1);
  }
  dock.appendChild(draggedShip);
  draggedShip = null;

  updateFinishSetupButton();
}

function isPlaceable(x, y, width, height) {
  if (x < 0 || y < 0 || x + width > 10 || y + height > 10) {
    console.log("out of range");
    return false;
  }
  return !placedShips.some(
    (ship) =>
      (draggedShip === null || !(ship === draggedShip)) &&
      x < Number(ship.dataset.x) + Number(ship.dataset.width) &&
      x + width > Number(ship.dataset.x) &&
      y < Number(ship.dataset.y) + Number(ship.dataset.height) &&
      y + height > Number(ship.dataset.y)
  );
}

function updateFinishSetupButton() {
  if (allShipsPlaced()) {
    message.appendChild(finishSetupButton);
  } else {
    finishSetupButton.remove();
  }
}

function allShipsPlaced() {
  return placedShips.length === 5;
}

function bindClickFinishSetup(handler) {
  finishSetupButton.addEventListener("click", () =>
    handler(
      placedShips.map((ship) => ({
        x: Number(ship.dataset.x),
        y: Number(ship.dataset.y),
        length: Number(ship.dataset.length),
        direction: ship.classList.contains("vertical")
          ? "vertical"
          : "horizontal",
      })),
      name.value
    )
  );
}

export { render, bindClickFinishSetup };
