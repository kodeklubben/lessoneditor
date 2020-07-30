import React from "react";
import MDTextArea from "components/editor/MDTextArea";
import { shallow } from "enzyme";

it("should set textarea change", () => {
  const onChangeSpy = jest.fn();

  const wrapper = shallow(
    <MDTextArea setCursor={onChangeSpy} setMdText={onChangeSpy} />
  );
  wrapper
    .find("textarea")
    .simulate("change", { target: { value: "testText" } });

  expect(onChangeSpy).toHaveBeenCalled();
});
