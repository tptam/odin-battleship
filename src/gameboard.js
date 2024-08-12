import { Ship } from "./ship.js";
import PubSub from "PubSub";

export const Gameboard = () => {
  const board = [...Array(10)].map(() => Array(10).fill(null));
  const missedAttacks = [];
  const hits = [];
  const pubsub = new PubSub();

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

  const isPlaceable = (x, y, length, direction) => {
    let cells;
    if (direction === "vertical") {
      if (y + length >= 10) {
        return false;
      }
      cells = [...Array(length).keys()].map((val) => ({
        x: x,
        y: y + val,
      }));
    } else {
      if (x + length >= 10) {
        return false;
      }
      cells = [...Array(length).keys()].map((val) => ({
        x: x + val,
        y: y,
      }));
    }
    return cells.every((cell) => board[cell.x][cell.y] === null);
  };

  const getShipAt = (x, y) => board[x][y];

  const receiveAttack = (x, y) => {
    const target = getShipAt(x, y);
    if (target === null) {
      missedAttacks.push({ x, y });
    } else {
      target.hit();
      hits.push({ x, y });
    }
    pubsub.publish("receive_attack");
  };

  const getAllShips = () => {
    const ships = board.flat().filter((val) => val !== null);
    return [...new Set(ships)];
  };

  const allShipsSunk = () => {
    const ships = getAllShips();
    if (ships.length === 0) {
      return false;
    }
    return ships.filter((ship) => !ship.isSunk()).length === 0;
  };

  return {
    pubsub,
    missedAttacks,
    hits,
    getAllShips,
    allShipsSunk,
    placeShip,
    getShipAt,
    receiveAttack,
    isPlaceable,
  };
};
