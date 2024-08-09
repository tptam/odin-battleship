import { Ship } from "./ship.js";

export const Gameboard = () => {
  const board = Array(10).fill(Array(10).fill(null));

  const placeShip = (x, y, length, direction) => {
    let cells;
    if (direction === "vertical") {
      cells = [...Array(length).keys()].map((val) => ({ x: x, y: y + val }));
    } else {
      cells = [...Array(length).keys()].map((val) => ({ x: x + val, y: y }));
    }
    if (cells.every((cell) => board[cell.x][cell.y] === null)) {
      const ship = Ship(length);
      cells.forEach((cell) => (board[cell.x][cell.y] = ship));
    }
  };

  const getShipAt = (x, y) => board[x][y];

  return {
    missedAttacks: [],
    areAllShipsSunk: () => false,
    placeShip,
    getShipAt,
  };
};
