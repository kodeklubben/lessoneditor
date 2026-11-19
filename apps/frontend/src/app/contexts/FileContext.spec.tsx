import { TextDecoder, TextEncoder } from "util";
import { act, render, waitFor } from "@testing-library/react";
import type { FileContextModel } from "./fileContext.functions";

// react-router needs these, and jsdom does not have them.
Object.assign(globalThis, { TextEncoder, TextDecoder });
const { MemoryRouter, Route, Routes } = require("react-router");
const { FileContextProvider, useFileContext } = require("./FileContext");

jest.mock("axios", () => ({
  __esModule: true,
  default: { get: jest.fn(), put: jest.fn() },
}));
const axios = require("axios").default as { get: jest.Mock; put: jest.Mock };

const raw =
  "---\ntitle: Gammel tittel\nauthorList:\n  - Ada\nlanguage: nb\n---\nTekst\n\n---\n\nmer";

describe("saving a lesson file", () => {
  let contexts: FileContextModel[] = [];
  const Probe = () => {
    contexts.push(useFileContext());
    return null;
  };

  beforeEach(() => {
    contexts = [];
    axios.get.mockResolvedValue({ data: { content: raw } });
    axios.put.mockResolvedValue({ status: 200, data: {} });
  });

  it("never writes an old header back, even from an old render's save function (K2)", async () => {
    render(
      <MemoryRouter initialEntries={["/editor/1/hei/nb"]}>
        <Routes>
          <Route
            path="/editor/:lessonId/:file/:lang"
            element={
              <FileContextProvider>
                <Probe />
              </FileContextProvider>
            }
          />
        </Routes>
      </MemoryRouter>,
    );
    await waitFor(() => expect(contexts.length).toBeGreaterThan(0));
    const first = contexts[0];
    expect(first.state.headerData.title).toBe("Gammel tittel");
    expect(first.savedFileBody).toBe("Tekst\n\n---\n\nmer");

    await act(async () => {
      await contexts[contexts.length - 1].saveFileHeader({
        ...first.state.headerData,
        title: "Ny tittel",
      });
    });
    await act(async () => {
      await first.saveFileBody("Ny tekst");
    });

    const [url, body] = axios.put.mock.calls[axios.put.mock.calls.length - 1];
    expect(url).toBe("/api/lesson/1/files/hei");
    expect(body.content).toContain("title: Ny tittel");
    expect(body.content).toContain("---\nNy tekst");
    // The thumbnail is no longer part of saving (K5).
    expect(axios.put.mock.calls.some(([u]: [string]) => u.includes("updateThumbnail"))).toBe(false);
  });
});
