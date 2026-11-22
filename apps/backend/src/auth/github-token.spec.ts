import { decryptToken, encryptToken, revokeGithubToken } from "./github-token";

describe("GitHub token in the session", () => {
  const secret = "test-only-session-secret";

  it("round-trips and never stores the token in clear text", () => {
    const encrypted = encryptToken("gho_example", secret);
    expect(encrypted).not.toContain("gho_example");
    expect(encryptToken("gho_example", secret)).not.toBe(encrypted);
    expect(decryptToken(encrypted, secret)).toBe("gho_example");
  });

  it("rejects tampering, another secret and garbage", () => {
    const encrypted = encryptToken("gho_example", secret);
    const parts = encrypted.split(".");
    parts[3] = Buffer.from("other").toString("base64url");
    expect(decryptToken(parts.join("."), secret)).toBeUndefined();
    expect(decryptToken(encrypted, "another-secret")).toBeUndefined();
    expect(decryptToken("gho_example", secret)).toBeUndefined();
    expect(decryptToken(undefined, secret)).toBeUndefined();
  });

  it("revokes at GitHub with the app credentials, not the user token, as auth", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({ status: 204 });
    await expect(revokeGithubToken("gho_example", fetchImpl, "client", "secret")).resolves.toBe(
      true,
    );
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.github.com/applications/client/token");
    expect(init.method).toBe("DELETE");
    expect(init.headers.Authorization).toBe(
      `Basic ${Buffer.from("client:secret").toString("base64")}`,
    );
    expect(JSON.parse(init.body)).toEqual({ access_token: "gho_example" });
  });

  it("does not block logout when GitHub is unreachable", async () => {
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
    const fetchImpl = jest.fn().mockRejectedValue(new Error("gho_example leaked?"));
    await expect(revokeGithubToken("gho_example", fetchImpl, "client", "secret")).resolves.toBe(
      false,
    );
    expect(JSON.stringify(error.mock.calls)).not.toContain("gho_example");
    error.mockRestore();
  });
});
