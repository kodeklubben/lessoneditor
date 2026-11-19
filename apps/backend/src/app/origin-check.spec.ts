import { isAllowedWrite } from "./origin-check";

describe("Origin check on writes", () => {
  const app = "https://lessoneditor.example";

  it("lets reads through from anywhere", () => {
    expect(isAllowedWrite("GET", { origin: "https://evil.example" }, app)).toBe(true);
  });

  it("allows writes from the editor itself", () => {
    expect(isAllowedWrite("PUT", { origin: app }, app)).toBe(true);
    expect(isAllowedWrite("POST", { "sec-fetch-site": "same-origin" }, app)).toBe(true);
  });

  it("refuses writes from other sites", () => {
    expect(isAllowedWrite("POST", { origin: "https://evil.example" }, app)).toBe(false);
    expect(isAllowedWrite("DELETE", { origin: "null" }, app)).toBe(false);
    expect(isAllowedWrite("PUT", { "sec-fetch-site": "cross-site" }, app)).toBe(false);
    expect(isAllowedWrite("POST", { "sec-fetch-site": "same-site" }, app)).toBe(false);
  });

  it("allows non-browser clients, which carry no victim cookies", () => {
    expect(isAllowedWrite("POST", {}, app)).toBe(true);
  });
});
