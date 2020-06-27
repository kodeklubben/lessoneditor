import React from "react";
import PageButtons from "../components/PageButtons";
import { shallow } from "enzyme";

it("should call setPageNumber", () => {
  const setPageNumber = jest.fn();
  const wrapper = shallow(
    <PageButtons
      prevTitle={"Previous"}
      nextTitle={"Next"}
      setPageNumber={setPageNumber}
      err="author"
      setErr={(e) => {
        console.log(e);
      }}
      state={{}}
    ></PageButtons>
  );
  wrapper.find("button").first().simulate("click");
  expect(setPageNumber).toHaveBeenCalled();
});
