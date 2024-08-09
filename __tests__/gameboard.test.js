import { Gameboard } from "../src/gameboard.js";
import { Ship } from "../src/ship.js";

jest.mock("../src/ship.js");

let gb;

beforeEach(() => {
  gb = Gameboard();
  Ship.mockClear();
});

it("constructor", () => {
  expect(gb.missedAttacks).toEqual([]);
  expect(gb.allShipsSunk()).toBe(false);
});

it("getShipAt", () => {
  const ship = {};
  Ship.mockReturnValue(ship);
  gb.placeShip(0, 0, 1, "vertical");
  expect(gb.getShipAt(0, 0)).toEqual(ship);
});

it("placeShip/vertical", () => {
  const ship = {};
  Ship.mockReturnValue(ship);
  gb.placeShip(0, 0, 3, "vertical");
  expect(Ship).toHaveBeenCalledWith(3);
  expect(gb.getShipAt(0, 0)).toEqual(ship);
  expect(gb.getShipAt(0, 1)).toEqual(ship);
  expect(gb.getShipAt(0, 2)).toEqual(ship);
});

it("placeShip/horizontal", () => {
  const ship = {};
  Ship.mockReturnValue(ship);
  gb.placeShip(0, 0, 3, "horizontal");
  expect(Ship).toHaveBeenCalledWith(3);
  expect(gb.getShipAt(0, 0)).toEqual(ship);
  expect(gb.getShipAt(1, 0)).toEqual(ship);
  expect(gb.getShipAt(2, 0)).toEqual(ship);
});

it("receiveAttack/hit", () => {
  const ship = { length: 3, hit: jest.fn() };
  Ship.mockReturnValue(ship);
  gb.placeShip(0, 0, 3, "vertical");
  gb.receiveAttack(0, 0);
  expect(ship.hit).toHaveBeenCalled();
});

it("receiveAttack/miss", () => {
  const ship = { length: 3, hit: jest.fn() };
  Ship.mockReturnValue(ship);
  gb.placeShip(0, 0, 3, "vertical");
  expect(gb.getShipAt(0, 0)).toEqual(ship);
  expect(gb.getShipAt(0, 1)).toEqual(ship);
  expect(gb.getShipAt(0, 2)).toEqual(ship);
  expect(gb.getShipAt(1, 2)).toEqual(null);
  gb.receiveAttack(1, 2);
  expect(ship.hit).not.toHaveBeenCalled();
  expect(gb.missedAttacks).toEqual([{ x: 1, y: 2 }]);
});

it("allShipsSunk/true", () => {
  const ship1 = { length: 3, isSunk: () => true };
  const ship2 = { length: 4, isSunk: () => true };
  Ship.mockReturnValueOnce(ship1).mockReturnValueOnce(ship2);
  gb.placeShip(0, 0, 3, "vertical");
  gb.placeShip(4, 0, 4, "horizontal");
  expect(gb.allShipsSunk()).toBe(true);
});

it("allShipsSunk/false", () => {
  const ship1 = { length: 3, isSunk: () => true };
  const ship2 = { length: 4, isSunk: () => false };
  Ship.mockReturnValueOnce(ship1).mockReturnValueOnce(ship2);
  gb.placeShip(0, 0, 3, "vertical");
  gb.placeShip(4, 0, 4, "horizontal");
  expect(gb.allShipsSunk()).toBe(false);
});
