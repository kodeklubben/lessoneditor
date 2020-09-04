const imageDisplayUrl = require("./image-display-url");

it("should return default image display url", () => {
  const lessonId = "asdfqwe";
  const url = imageDisplayUrl(lessonId);
  expect(url).toBe("/file/drafts/asdfqwe/");
});

it("should return display url for default scratch images", () => {
  const lessonId = "asdfqwe";
  const url = imageDisplayUrl(lessonId, true);
  expect(url).toBe("/file/bilder/");
});
