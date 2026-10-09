module.exports = {
  displayName: "backend",
  preset: "../../jest.preset.js",
  testEnvironment: "node",
  transform: { "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }] },
  moduleNameMapper: { "^@lessoneditor/contracts$": "<rootDir>/../../libs/contracts/src/index.ts" },
};
