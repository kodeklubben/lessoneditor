import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Editor from "components/editor/Editor";
import { LessonContextProvider } from "../../contexts/LessonContext";
import userEvent from "@testing-library/user-event";
import each from "jest-each";

const WrappedEditor = (
  <MemoryRouter>
    <LessonContextProvider>
      <Editor />
    </LessonContextProvider>
  </MemoryRouter>
);

describe("textarea", () => {
  it("should show text in textarea", () => {
    render(WrappedEditor);
    //const textarea = screen.queryByRole('textbox');
    //fireEvent.change(textarea, {target: {value: '# test'}});
    //expect(textarea.value).toEqual('# test');
  });
});

describe("preview-area", () => {
  each([
    ["*test*", "<em>test</em>"],
    ["**test**", "<strong>test</strong>"],
    ["# test", "<h1>test</h1>"],
    ["## test", "<h2>test</h2>"],
  ]).it("should render '%s' correctly", (input, output) => {
    render(WrappedEditor);
    userEvent.type(screen.getByRole("textbox"), input);
    expect(screen.queryByTestId("PreviewArea").outerHTML).toContain(output);
  });
});
