import { TextDecoder, TextEncoder } from "util";
import { useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

// react-router needs these, and jsdom does not have them.
Object.assign(globalThis, { TextEncoder, TextDecoder });
const { MemoryRouter } = require("react-router");
const { default: NewLessonModal, newLessonProblem } = require("./NewLessonModal");

const mockAddLesson = jest.fn();
jest.mock("../../contexts/UserContext", () => ({
  useUserContext: () => ({ addLesson: mockAddLesson }),
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

  it("says why a title cannot become a folder name (P2-8)", () => {
    expect(newLessonProblem("  ", "scratch")).toBe("Oppgavetittel må være satt");
    expect(newLessonProblem("🐱🐱🐱", "scratch")).toMatch(/minst én bokstav/);
    expect(newLessonProblem("x".repeat(201), "scratch")).toMatch(/høyst 200 tegn/);
    expect(newLessonProblem("Asteroids", "🐱")).toMatch(/Kursnavnet/);
    expect(newLessonProblem("Asteroids", "scratch")).toBeNull();
  });

  it("shows the server's reason when the name is taken", async () => {
    mockAddLesson.mockRejectedValue({
      response: {
        status: 409,
        data: { message: "Det finnes allerede en publisert oppgave i src/scratch/asteroids." },
      },
    });
    render(
      <MemoryRouter>
        <Frontpage />
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Ny oppgave" }));
    fireEvent.change(document.querySelector("input[name=lessonTitle]") as HTMLInputElement, {
      target: { value: "Asteroids" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Neste" }));
    await waitFor(() =>
      expect(screen.getByText(/publisert oppgave i src\/scratch\/asteroids/)).toBeTruthy(),
    );
    expect(mockAddLesson).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(String),
      "asteroids",
      "Asteroids",
      "nb",
    );
  });
});
