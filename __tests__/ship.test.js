// Your ‘ships’ will be objects that include their length, the number of times they’ve been hit and whether or not they’ve been sunk.
// Ships should have a hit() function that increases the number of ‘hits’ in your ship.
// isSunk() should be a function that calculates whether a ship is considered sunk based on its length and the number of hits it has received.

import { Ship } from "../src/ship.js";

it("constructor 1", () => {
  const ship = Ship(3);
  expect(ship.length).toBe(3);
  expect(ship.isSunk()).toBe(false);
});

it("constructor 2", () => {
  const ship = Ship(2);
  expect(ship.length).toBe(2);
  expect(ship.isSunk()).toBe(false);
});

it("hit and not sunk", () => {
  const ship = Ship(3);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
});

it("hit and sunk", () => {
  const ship = Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});
