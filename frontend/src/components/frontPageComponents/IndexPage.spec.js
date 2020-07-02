import React from "react";
import { shallow } from "enzyme";
import IndexPage from "components/frontPageComponents/IndexPage";

let wrapper;

beforeEach(() => {
  wrapper = shallow(<IndexPage />);
});

it("should render buttons", () => {
  expect(wrapper.find("button").length).toBeGreaterThan(0);
});

it("should redirect to a given link", () => {
  const initLinkAdress = "/myPage";

  expect(wrapper.find("Link").at(0).prop("to")).toEqual(initLinkAdress);
});
