import React from "react";
import MDTextArea from "components/editor/MDTextArea";
import { shallow } from "enzyme";

it("should set text area change", () => {
  const onChangeSpy = jest.fn();

  const wrapper = shallow(<MDTextArea />);
  wrapper.find("textarea").simulate("change");

  expect(onChangeSpy).toHaveBeenCalled();
});
