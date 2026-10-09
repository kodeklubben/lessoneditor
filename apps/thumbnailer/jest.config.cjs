module.exports = {
  displayName: "thumbnailer",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: { "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }] },
};
