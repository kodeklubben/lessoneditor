import { TextDecoder, TextEncoder } from "util";
import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

// react-router needs these, and jsdom does not have them.
Object.assign(globalThis, { TextEncoder, TextDecoder });

const emptyYml = () => ({
  level: 1,
  license: "CC BY-SA 4.0",
  tags: { topic: [], subject: [], grade: [] },
});

// The lesson's data lives in LessonContext; here in a small state of the test's own.
let mockContext: any;
jest.mock("../../../contexts/LessonContext", () => ({ useLessonContext: () => mockContext }));
const { MemoryRouter } = require("react-router");
const { default: LandingpageDatamodal } = require("./LandingpageDatamodal");

const WithContext = () => {
  const [yml, setYml] = useState<any>(emptyYml());
  mockContext = { state: { lesson: { lessonId: 9 } }, yml, setYml, updateYaml: jest.fn() };
  return <LandingpageDatamodal />;
};

describe("LandingpageDatamodal", () => {
  const consoleError = console.error;
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation((message, ...rest) => {
      if (String(message).startsWith("Accessing element.ref was removed in React 19")) return;
      consoleError(message, ...rest);
    });
  });
  afterAll(() => jest.restoreAllMocks());

  it("opens by itself for a lesson without data, and «Senere» closes it for good", async () => {
    render(
      <MemoryRouter>
        <WithContext />
      </MemoryRouter>,
    );
    expect(await screen.findByRole("button", { name: "Senere" })).toBeTruthy();
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Senere" }));
    });
    expect(screen.queryByRole("button", { name: "Senere" })).toBeNull();
  });
});
