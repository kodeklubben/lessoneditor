import { rememberReturnTo, takeReturnTo } from "./returnTo";

describe("return after sign-in", () => {
  beforeEach(() => sessionStorage.clear());

  it("returns to the page once", () => {
    rememberReturnTo("/rediger/scratch/asteroids");
    expect(takeReturnTo()).toBe("/rediger/scratch/asteroids");
    expect(takeReturnTo()).toBeNull();
  });

  it("does not remember other sites or the front page", () => {
    for (const path of ["//evil.example/x", "https://evil.example", "/\\evil.example", "/"]) {
      rememberReturnTo(path);
      expect(takeReturnTo()).toBeNull();
    }
  });
});
