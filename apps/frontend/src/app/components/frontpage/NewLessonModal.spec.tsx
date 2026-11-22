import { TextDecoder, TextEncoder } from "util";
import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";

// react-router needs these, and jsdom does not have them.
Object.assign(globalThis, { TextEncoder, TextDecoder });
const { MemoryRouter } = require("react-router");
const NewLessonModal = require("./NewLessonModal").default;

jest.mock("../../contexts/UserContext", () => ({
  useUserContext: () => ({ addLesson: jest.fn() }),
}));

const Frontpage = () => {
  const [open, setOpen] = useState(false);
  return <NewLessonModal openNewLessonModal={open} setOpenNewLessonModal={setOpen} />;
};

describe("NewLessonModal", () => {
  // Semantic UI React reads element.ref, which React 19 warns about; everything else still shows.
  const consoleError = console.error;
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((message, ...rest) => {
      if (String(message).startsWith("Accessing element.ref was removed in React 19")) return;
      consoleError(message, ...rest);
    });
  });
  afterAll(() => jest.restoreAllMocks());

  it("opens from its own «Ny oppgave» button", () => {
    render(
      <MemoryRouter>
        <Frontpage />
      </MemoryRouter>,
    );
    expect(screen.queryByText("Opprett en ny oppgave")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Ny oppgave" }));
    expect(screen.getByText("Opprett en ny oppgave")).toBeTruthy();
  });
});
