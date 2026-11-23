import { TextDecoder, TextEncoder } from "util";

// react-router needs these, and jsdom does not have them.
Object.assign(globalThis, { TextEncoder, TextDecoder });
jest.mock("axios", () => ({}));
const { sortLessons } = require("./Frontpage");

describe("sorting the cards by status", () => {
  const lesson = (lessonId: number, submitted: boolean, updated_at: string) =>
    ({ lessonId, submitted, updated_at, lessonTitle: "", courseTitle: "" }) as never;

  it("puts waiting first, then published, not taken, and not submitted, newest first within each", () => {
    const lessons = [
      lesson(1, false, "2026-11-23"),
      lesson(2, true, "2026-11-01"),
      lesson(3, true, "2026-11-02"),
      lesson(4, true, "2026-11-03"),
      lesson(5, true, "2026-11-04"),
      lesson(6, false, "2026-11-20"),
    ];
    const pullRequests = {
      2: { state: "merged", url: "" },
      3: { state: "closed", url: "" },
      4: { state: "open", url: "" },
      // 5: submitted, GitHub did not answer: counted as waiting.
    };
    const order = sortLessons(lessons, "status", pullRequests).map(
      (l: { lessonId: number }) => l.lessonId,
    );
    expect(order).toEqual([5, 4, 2, 3, 1, 6]);
  });
});
