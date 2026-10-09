import { previewUrl } from "./preview-url";

describe("thumbnail URL validation", () => {
  const base = "http://localhost:4200";
  it("accepts an app preview", () => {
    expect(previewUrl(`${base}/preview/3/oppgave`, base).href).toBe(`${base}/preview/3/oppgave`);
  });
  it.each([
    "http://169.254.169.254/latest/meta-data",
    "http://localhost:8080/preview/3/test",
    `${base}/api/user`,
    `${base}/preview/3/test?redirect=https://example.org`,
    "http://user:pass@localhost:4200/preview/3/test",
    "file:///etc/passwd",
    ["http://localhost:4200/preview/3/test"],
  ])("rejects destinations outside the preview contract: %s", (url) => {
    expect(() => previewUrl(url, base)).toThrow();
  });
});
