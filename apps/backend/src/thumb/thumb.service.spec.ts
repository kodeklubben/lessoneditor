import { verify, JwtPayload } from "jsonwebtoken";
import { PREVIEW_TOKEN_HEADER, ThumbService } from "./thumb.service";

it("creates expiring read-only thumbnail credentials without logging them", () => {
  const service = new ThumbService(undefined);
  const token = service.createJwtToken(42, "test-secret");
  const decoded = verify(token, "test-secret", {
    audience: "lessoneditor-thumbnail",
  }) as JwtPayload;
  expect(decoded.sub).toBe("42");
  expect(decoded.exp - decoded.iat).toBe(300);
});

it("sends the token in a header and keeps it out of the URL", () => {
  process.env.THUMB_SERVICE_URL = "https://thumbs.example/thumbnailer";
  process.env.JWT_SECRET = "test-secret";
  const service = new ThumbService(undefined);
  const { url, headers } = service.thumbRequest("https://app.example/preview/1/hei", {
    userId: 7,
  } as never);
  expect(new URL(url).searchParams.get("url")).toBe("https://app.example/preview/1/hei");
  expect(url).not.toContain("token");
  expect((verify(headers[PREVIEW_TOKEN_HEADER], "test-secret") as JwtPayload).sub).toBe("7");
});
