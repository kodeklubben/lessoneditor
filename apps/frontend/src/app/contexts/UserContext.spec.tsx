import { TextDecoder, TextEncoder } from "util";
import { act, render, waitFor } from "@testing-library/react";
import type { UserContextModel } from "./userContext.functions";

// react-router needs these, and jsdom does not have them.
Object.assign(globalThis, { TextEncoder, TextDecoder });
const { MemoryRouter, Route, Routes, useNavigate } = require("react-router");
const { UserContextProvider, useUserContext } = require("./UserContext");
const { paths } = require("@lessoneditor/contracts");

jest.mock("axios", () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), delete: jest.fn() },
}));
const axios = require("axios").default as { get: jest.Mock };

const lesson = (lessonId: number) => ({ lessonId, lessonTitle: `Oppgave ${lessonId}` });

describe("the user's lessons follow the app without a reload", () => {
  let contexts: UserContextModel[] = [];
  let go: (path: string) => void = () => undefined;
  const Probe = () => {
    contexts.push(useUserContext());
    go = useNavigate();
    return null;
  };
  const page = (
    <UserContextProvider>
      <Probe />
    </UserContextProvider>
  );
  let onServer = [lesson(1)];

  beforeEach(() => {
    contexts = [];
    onServer = [lesson(1)];
    axios.get.mockImplementation(async (url: string) => {
      if (url === paths.USER) return { data: { userId: 7 } };
      if (url === paths.USER_LESSONS.replace(":userId", "7")) return { data: onServer };
      throw new Error("no preview"); // thumbnails: none
    });
  });

  const lessons = () => contexts[contexts.length - 1].state.lessons.map((l) => l.lessonId);

  it("shows a lesson copied on another page when the front page is opened again", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={page} />
          <Route path="/landingpage/:lessonId/" element={page} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(lessons()).toEqual([1]));

    // «Lag kopi» in «Finn en oppgave»: the server has a new lesson, and the app opens it.
    onServer = [lesson(1), lesson(2)];
    await act(async () => go("/landingpage/2"));
    await act(async () => go("/"));
    await waitFor(() => expect(lessons()).toEqual([1, 2]));
  });

  it("reads the list again when the tab comes back after a while", async () => {
    const now = jest.spyOn(Date, "now");
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={page} />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(lessons()).toEqual([1]));
    onServer = [lesson(1), lesson(3)];
    now.mockReturnValue(Date.now() + 60_000);
    await act(async () => {
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await waitFor(() => expect(lessons()).toEqual([1, 3]));
    now.mockRestore();
  });
});
