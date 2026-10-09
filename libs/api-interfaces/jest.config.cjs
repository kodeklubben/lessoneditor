module.exports = {
  displayName: "api-interfaces",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: { "^.+\\.ts$": ["ts-jest", { tsconfig: { module: "commonjs" } }] },
};
