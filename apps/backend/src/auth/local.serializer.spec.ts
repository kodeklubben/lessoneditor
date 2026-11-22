import { HttpException, HttpStatus } from "@nestjs/common";
import { GithubSerializer } from "./local.serializer";

const serializer = (getUser: jest.Mock) => new GithubSerializer({ getUser } as never);

describe("session users", () => {
  it("are loaded by id", async () => {
    const done = jest.fn();
    await serializer(jest.fn().mockResolvedValue({ userId: 1 })).deserializeUser(1, done);
    expect(done).toHaveBeenCalledWith(null, { userId: 1 });
  });

  it("count as logged out when the user no longer exists", async () => {
    const done = jest.fn();
    const missing = jest
      .fn()
      .mockRejectedValue(new HttpException("User does not exist", HttpStatus.NOT_FOUND));
    await serializer(missing).deserializeUser(1, done);
    expect(done).toHaveBeenCalledWith(null, false);
  });

  it("pass other errors on", async () => {
    const done = jest.fn();
    const error = new Error("database down");
    await serializer(jest.fn().mockRejectedValue(error)).deserializeUser(1, done);
    expect(done).toHaveBeenCalledWith(error);
  });
});
