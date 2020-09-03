const imageDisplayUrl = require("./image-display-url");

it("should return default image display url", () => {
  const lessonId = "asdfqwe";
  const url = imageDisplayUrl(lessonId, "http://localhost:3232");
  expect(url).toBe("http://localhost:3232/api/display/asdfqwe");
});

it("should return display url for default scratch images", () => {
  const lessonId = "asdfqwe";
  const url = imageDisplayUrl(lessonId, "http://localhost:3232", true);
  expect(url).toBe("http://localhost:3232/api/display/scratch");
});
