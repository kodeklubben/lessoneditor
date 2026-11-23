import { TextDecoder, TextEncoder } from "util";
import { act, fireEvent, render, screen } from "@testing-library/react";

// react-router needs these, and jsdom does not have them.
Object.assign(globalThis, { TextEncoder, TextDecoder });
const mockPost = jest.fn();
jest.mock("axios", () => ({ post: (...args: unknown[]) => mockPost(...args) }));
const { MemoryRouter } = require("react-router");
const { default: SubmitLessonModal } = require("./SubmitLessonModal");

describe("SubmitLessonModal", () => {
  const consoleError = console.error;
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((message, ...rest) => {
      if (String(message).startsWith("Accessing element.ref was removed in React 19")) return;
      if (String(message).includes("Request failed")) return;
      consoleError(message, ...rest);
    });
  });
  afterAll(() => jest.restoreAllMocks());

  const open = (mode: string, pullRequest?: object) =>
    render(
      <MemoryRouter>
        <SubmitLessonModal
          openSubmitModal
          setOpenSubmitModal={() => undefined}
          lessonId="9"
          mode={mode}
          pullRequest={pullRequest}
          onSubmitted={() => undefined}
        />
      </MemoryRouter>,
    );

  it("says it is sending while it does, then shows why it failed (4)", async () => {
    let fail: (error: unknown) => void = () => undefined;
    mockPost.mockReturnValue(new Promise((_resolve, reject) => (fail = reject)));
    open("new");
    fireEvent.click(screen.getByRole("button", { name: "Sende inn" }));
    expect(screen.getByRole("button", { name: /Sender inn …/ })).toHaveProperty("disabled", true);
    await act(async () =>
      fail({ response: { status: 403, data: { message: "GitHub submission is disabled" } } }),
    );
    expect(screen.queryByText(/Sender inn …/)).toBeNull();
    expect(screen.getByRole("alert").textContent).not.toBe("");
  });

  it("explains an update and a new submission after a closed one (3)", () => {
    const pr = { state: "open", url: "https://github.com/kodeklubben/oppgaver/pull/1" };
    const { unmount } = open("update", pr);
    expect(screen.getByText(/Det blir ikke et nytt forslag/)).toBeTruthy();
    unmount();
    open("again", { state: "closed", url: pr.url });
    expect(screen.getByText(/lukket uten å bli tatt med/)).toBeTruthy();
    expect(screen.getByRole("link", { name: "Se det forrige" })).toBeTruthy();
  });
});
