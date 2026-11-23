import { TextDecoder, TextEncoder } from "util";

// react-router needs these, and jsdom does not have them.
Object.assign(globalThis, { TextEncoder, TextDecoder });
jest.mock("axios", () => ({}));
const { importErrorMessage } = require("./ImportLesson");

describe("messages for a refused import", () => {
  const refused = (status: number, message: unknown) => ({
    response: { status, data: { message } },
  });

  it("shows the server's own words for a lesson it cannot copy", () => {
    expect(importErrorMessage(refused(422, "Oppgaven mangler lesson.yml."))).toBe(
      "Oppgaven mangler lesson.yml.",
    );
  });

  it("explains the address instead of blaming GitHub for a 400 with field messages (P2-9)", () => {
    expect(importErrorMessage(refused(400, ["course must match /^[a-z0-9]+$/"]))).toMatch(
      /\/rediger\/scratch\/asteroids/,
    );
  });

  it("blames GitHub only when the server or GitHub failed", () => {
    expect(importErrorMessage(refused(502, "Bad gateway"))).toMatch(/GitHub/);
    expect(importErrorMessage(new Error("Network Error"))).toMatch(/GitHub/);
  });
});
