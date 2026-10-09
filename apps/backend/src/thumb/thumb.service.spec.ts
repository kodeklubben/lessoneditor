import { verify, JwtPayload } from "jsonwebtoken";
import { ThumbService } from "./thumb.service";

it("creates expiring read-only thumbnail credentials without logging them", () => {
  const service = new ThumbService(undefined);
  const token = service.createJwtToken(42, "test-secret");
  const decoded = verify(token, "test-secret", {
    audience: "lessoneditor-thumbnail",
  }) as JwtPayload;
  expect(decoded.sub).toBe("42");
  expect(decoded.exp - decoded.iat).toBe(300);
});
