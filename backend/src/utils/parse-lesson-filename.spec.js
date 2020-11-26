const parseLessonFilename = require("./parse-lesson-filename");
it("should parse lesson filename", () => {
  const result = parseLessonFilename("mylesson_and_nn");
  expect(result).toStrictEqual({ basename: "mylesson_and", lanuage: "nn" });
});

it("should parse lesson filename and default to NB", () => {
  const result = parseLessonFilename("mylesson_and");
  expect(result).toStrictEqual({ basename: "mylesson_and", lanuage: "nb" });
});
