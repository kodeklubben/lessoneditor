const isAppEngine = require("./isAppEngine");
it("should be falsy", () => {
  expect(isAppEngine()).toBe(false);
});
