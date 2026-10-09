import { ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { sign } from "jsonwebtoken";
import { Cache } from "cache-manager";
import { DataSource } from "typeorm";
import { LoginGuard } from "./login.guard";

describe("API access", () => {
  const secret = "test-only-secret";
  const exists = jest.fn();
  const guard = new LoginGuard(
    {} as Cache,
    { getRepository: () => ({ exists }) } as unknown as DataSource,
  );
  const context = (overrides = {}) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
          method: "GET",
          path: "/api/user",
          params: {},
          user: { userId: 12 },
          ...overrides,
        }),
        getResponse: () => ({}),
      }),
    }) as ExecutionContext;

  beforeEach(() => {
    process.env.GH_CLIENT_SECRET = secret;
    exists.mockReset();
  });

  it("returns 401 for an anonymous API request without starting OAuth", async () => {
    await expect(guard.canActivate(context({ user: undefined }))).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("rejects another user's URL", async () => {
    await expect(guard.canActivate(context({ params: { userId: "13" } }))).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it("checks lesson membership for read and write routes", async () => {
    exists.mockResolvedValue(false);
    await expect(
      guard.canActivate(context({ method: "PUT", params: { lessonId: "5" } })),
    ).rejects.toBeInstanceOf(ForbiddenException);
    expect(exists).toHaveBeenCalledWith({ where: { userId: 12, lessons: { lessonId: 5 } } });
    exists.mockResolvedValue(true);
    await expect(guard.canActivate(context({ params: { lessonId: "5" } }))).resolves.toBe(true);
  });

  it("allows a short-lived thumbnail token only for reading", async () => {
    const token = sign({}, secret, {
      subject: "12",
      audience: "lessoneditor-thumbnail",
      expiresIn: "5m",
    });
    const headers = { authorization: `Bearer ${token}` };
    await expect(guard.canActivate(context({ user: undefined, headers }))).resolves.toBe(true);
    await expect(
      guard.canActivate(context({ user: undefined, headers, method: "PUT" })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it.each([
    { subject: "12", audience: "lessoneditor-thumbnail" },
    { subject: "12", audience: "other", expiresIn: 300 },
    { subject: "12", audience: "lessoneditor-thumbnail", expiresIn: -1 },
  ])("rejects missing expiration, wrong audience and expired tokens", async (options) => {
    const token = sign({}, secret, options);
    await expect(
      guard.canActivate(context({ headers: { authorization: `Bearer ${token}` } })),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
