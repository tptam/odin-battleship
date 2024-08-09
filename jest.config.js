module.exports = {
  moduleFileExtensions: ["js", "jsx"],
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    "\\.(gif|ttf|eot|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
  transform: {
    "^.+\\.js$": "babel-jest",
  },
};
