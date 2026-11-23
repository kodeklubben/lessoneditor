import { announceThumbnail, onThumbnail } from "./thumbnailEvents";

describe("new thumbnails (N6)", () => {
  it("tells the listening pages which lesson got one, until they stop listening", () => {
    const heard: [number, string | undefined][] = [];
    const stop = onThumbnail((lessonId, filename) => heard.push([lessonId, filename]));
    announceThumbnail(7, "hei_nn");
    announceThumbnail(7);
    stop();
    announceThumbnail(8);
    expect(heard).toEqual([
      [7, "hei_nn"],
      [7, undefined],
    ]);
  });
});
