import { submitMode } from "./submitMode";

describe("what «Sende inn» does (3)", () => {
  const lesson = (submitted: boolean) => ({ submitted }) as never;
  const pr = (state: "open" | "merged" | "closed") => ({ state, url: "" });

  it("submits the first time, updates an open pull request, and asks before a new one", () => {
    expect(submitMode(lesson(false))).toBe("new");
    expect(submitMode(lesson(true), pr("open"))).toBe("update");
    // GitHub did not answer: the pull request is most likely still open.
    expect(submitMode(lesson(true))).toBe("update");
    expect(submitMode(lesson(true), pr("merged"))).toBe("again");
    expect(submitMode(lesson(true), pr("closed"))).toBe("again");
  });
});
