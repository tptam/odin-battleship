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
  expect(gb.areAllShipsSunk()).toBe(false);
});

it("placeShip", () => {
  const ship = {};
  Ship.mockReturnValue = ship;
  gb.placeShip(0, 0, 3, "vertical");
  expect(Ship).toHaveBeenCalledWith(3);
  //   expect(gb.getShipAt(0, 0)).toBe(ship);
  //   expect(gb.getShipAt(1, 0)).toBe(ship);
  //   expect(gb.getShipAt(2, 0)).toBe(ship);
});

it("receiveAttack/hit", () => {
  const ship = { length: 3, hit: jest.fn() };
  Ship.mockReturnValue = ship;
  gb.placeShip(0, 0, 3, "vertical");
  gb.receiveAttack(0, 0);
  expect(ship.hit).toHaveBeenCalled();
});

it("receiveAttack/miss", () => {
  const ship = { length: 3, hit: jest.fn() };
  Ship.mockReturnValue = ship;
  gb.placeShip(0, 0, 3, "vertical");
  gb.receiveAttack(1, 2);
  expect(ship.hit).not.toHaveBeenCalled();
  expect(gb.missedAttacks).toEqual([{ x: 1, y: 2 }]);
});

it("areAllShipsSunk/true", () => {
  const ship1 = { length: 3, isSunk: () => true };
  const ship2 = { length: 4, isSunk: () => true };
  Ship.mockReturnValueOnce(ship1).mockReturnValueOnce(ship2);
  gb.placeShip(0, 0, 3, "vertical");
  gb.placeShip(4, 0, 4, "horizontal");
  expect(gb.areAllShipsSunk()).toBe(true);
});

it("areAllShipsSunk/false", () => {
  const ship1 = { length: 3, isSunk: () => true };
  const ship2 = { length: 4, isSunk: () => false };
  Ship.mockReturnValueOnce(ship1).mockReturnValueOnce(ship2);
  gb.placeShip(0, 0, 3, "vertical");
  gb.placeShip(4, 0, 4, "horizontal");
  expect(gb.areAllShipsSunk()).toBe(false);
});
