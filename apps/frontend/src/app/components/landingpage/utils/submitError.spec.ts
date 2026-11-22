import { submitErrorMessage } from "./submitError";

const error = (status: number, message?: string) => ({ response: { status, data: { message } } });

describe("submission errors shown to the author", () => {
  it("asks to log in again when GitHub rejected the token", () => {
    expect(submitErrorMessage(error(401, "x"))).toMatch(/Logg ut og inn igjen/);
  });

  it("explains a disabled environment and passes on the server's own messages", () => {
    expect(
      submitErrorMessage(error(403, "GitHub submission is disabled in this environment")),
    ).toBe("Innsending er slått av i dette miljøet.");
    expect(submitErrorMessage(error(502, "GitHub svarte ikke som forventet."))).toBe(
      "GitHub svarte ikke som forventet.",
    );
  });

  it("falls back to a general message for network errors and 500", () => {
    expect(submitErrorMessage(new Error("Network Error"))).toMatch(/Prøv igjen/);
    expect(submitErrorMessage(error(500, "Internal server error"))).toMatch(/Prøv igjen/);
  });
});
