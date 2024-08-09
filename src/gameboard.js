import { Ship } from "./ship.js";

export const Gameboard = () => {
  const board = [...Array(10)].map(() => Array(10).fill(null));
  const missedAttacks = [];

  const placeShip = (x, y, length, direction) => {
    let cells;
    if (direction === "vertical") {
      cells = [...Array(length).keys()].map((val) => ({ x: x, y: y + val }));
    } else {
      cells = [...Array(length).keys()].map((val) => ({ x: x + val, y: y }));
    }
    if (cells.every((cell) => board[cell.x][cell.y] === null)) {
      const ship = Ship(length);
      cells.forEach((cell) => {
        board[cell.x][cell.y] = ship;
      });
    }
  };

  const getShipAt = (x, y) => board[x][y];

  const receiveAttack = (x, y) => {
    console.log(board);
    const target = getShipAt(x, y);
    if (target === null) {
      missedAttacks.push({ x, y });
    } else {
      target.hit();
    }
  };

  const allShipsSunk = () => {
    const ships = board.flat().filter((val) => val !== null);
    if (ships.length === 0) {
      return false;
    }
    return ships.filter((ship) => !ship.isSunk()).length === 0;
  };

  return {
    missedAttacks,
    allShipsSunk,
    placeShip,
    getShipAt,
    receiveAttack,
  };
};
