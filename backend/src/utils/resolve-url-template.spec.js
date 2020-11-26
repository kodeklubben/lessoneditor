const resolveUrlTemplate = require("./resolve-url-template");
it("should resolve", () => {
  const resolved = resolveUrlTemplate("/:first/:second", {
    first: "hello",
    second: "world",
  });
  expect(resolved).toBe("/hello/world");
});
