module.exports = {
  displayName: "frontend",
  preset: "../../jest.preset.js",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[tj]sx?$": [
      "babel-jest",
      {
        presets: [
          ["@babel/preset-env", { targets: { node: "current" } }],
          ["@babel/preset-react", { runtime: "automatic" }],
          "@babel/preset-typescript",
        ],
      },
    ],
  },
  moduleNameMapper: {
    "^@lessoneditor/contracts$": "<rootDir>/../../libs/contracts/src/index.ts",
    "\\.(jpg|ico|jpeg|png|gif|svg|woff2?|ttf|css|scss|less)$": "<rootDir>/__mocks__/fileMock.js",
  },
};
