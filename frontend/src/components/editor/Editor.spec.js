import React from "react";
import { mount } from "enzyme";
import { MemoryRouter } from "react-router-dom";
import Editor from "components/editor/Editor";

let wrapped;

beforeEach(() => {
  wrapped = mount(
    <MemoryRouter>
      <Editor />
    </MemoryRouter>
  );
});

afterEach(() => {
  wrapped.unmount();
});

describe("textarea", () => {
  it("should show text in textarea", () => {
    wrapped
      .find("textarea")
      .simulate("change", { target: { value: "# test" } });
    wrapped.update();
    expect(wrapped.find("textarea").prop("value")).toEqual("# test");
  });
});

describe("preview-area", () => {
  it("should render bold correctly", () => {
    wrapped
      .find("textarea")
      .simulate("change", { target: { value: "**test**" } });
    wrapped.update();
    expect(wrapped.find(".PreviewArea").html()).toEqual(
      '<div class="PreviewArea"><p><strong>test</strong></p>\n</div>'
    );
  });

  it("should render italic correctly", () => {
    wrapped
      .find("textarea")
      .simulate("change", { target: { value: "*test*" } });
    wrapped.update();
    expect(wrapped.find(".PreviewArea").html()).toEqual(
      '<div class="PreviewArea"><p><em>test</em></p>\n</div>'
    );
  });

  it("should render h1 correctly", () => {
    wrapped
      .find("textarea")
      .simulate("change", { target: { value: "# test" } });
    wrapped.update();
    expect(wrapped.find(".PreviewArea").html()).toEqual(
      '<div class="PreviewArea"><section>\n<h1>test</h1>\n</section>\n</div>'
    );
  });

  it("should render h2 correctly", () => {
    wrapped
      .find("textarea")
      .simulate("change", { target: { value: "## test" } });
    wrapped.update();
    expect(wrapped.find(".PreviewArea").html()).toEqual(
      '<div class="PreviewArea"><section>\n<h2>test</h2>\n</section>\n</div>'
    );
  });
});

// Denne feiler:

// describe("editor buttons", () => {
//   it("should output markdown syntax for bold to textarea after buttonclick", () => {
//     wrapped.find(".emphasis").find("button").at(0).simulate("click");
//     wrapped.update();
//     expect(wrapped.find("textarea").prop("value")).toEqual("****");
//   });
// });
