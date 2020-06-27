import React from "react";
import ItemList from "../../components/mypage/ItemList";
import { shallow } from "enzyme";

it("renders without crashing", () => {
  const oppgaveNavn = "Min nye oppgave til kidsa";
  const wrapper = shallow(<ItemList items={[oppgaveNavn]}></ItemList>);
  expect(wrapper.contains(oppgaveNavn)).toEqual(true);
});
