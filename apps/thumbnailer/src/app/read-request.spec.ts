import { readRequest } from "./read-request";

const frontend = "https://app.example";
const url = "https://app.example/preview/1/hei";
const headers =
  (values: Record<string, string>) =>
  (name: string): string | undefined =>
    values[name.toLowerCase()];

describe("thumbnail requests", () => {
  it("take the token from the X-Preview-Token header", () => {
    const request = readRequest({ url }, headers({ "x-preview-token": "abc" }), frontend);
    expect(request.token).toBe("abc");
    expect(request.url.href).toBe(url);
  });

  it("refuse a token in the query string, even next to the header", () => {
    expect(() =>
      readRequest({ url, token: "abc" }, headers({ "x-preview-token": "abc" }), frontend),
    ).toThrow();
  });

  it("refuse a missing token or a foreign preview URL", () => {
    expect(() => readRequest({ url }, headers({}), frontend)).toThrow();
    expect(() =>
      readRequest(
        { url: "https://evil.example/preview/1/hei" },
        headers({ "x-preview-token": "abc" }),
        frontend,
      ),
    ).toThrow();
  });
});
