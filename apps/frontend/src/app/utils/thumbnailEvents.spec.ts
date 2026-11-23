import { announceThumbnail, onThumbnail } from "./thumbnailEvents";

describe("new thumbnails (N6)", () => {
  it("tells the listening pages which lesson got one, until they stop listening", () => {
    const heard: number[] = [];
    const stop = onThumbnail((lessonId) => heard.push(lessonId));
    announceThumbnail(7);
    stop();
    announceThumbnail(8);
    expect(heard).toEqual([7]);
  });
});
