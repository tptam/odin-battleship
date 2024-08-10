import { Player } from "../src/player.js";
import { Gameboard } from "../src/gameboard.js";

jest.mock("../src/gameboard.js");

beforeEach(() => {
  Gameboard.mockClear();
});

it("constructor/real", () => {
  const gb = {};
  Gameboard.mockReturnValue(gb);
  const player = Player("real");
  expect(player.type).toEqual("real");
  expect(player.gameBoard).toEqual(gb);
});

it("constructor/real", () => {
  const gb = {};
  Gameboard.mockReturnValue(gb);
  const player = Player("computer");
  expect(player.type).toEqual("computer");
  expect(player.gameBoard).toEqual(gb);
});
