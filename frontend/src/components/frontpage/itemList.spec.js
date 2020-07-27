import React from "react";
import ItemList from "components/frontpage/ItemList";
import { shallow } from "enzyme";

it("renders without crashing", () => {
  const oppgaveNavn = "Min nye oppgave til kidsa";
  const imageUrl = ["url1", "url2"];
  const wrapper = shallow(
    <ItemList
      items={[{ title: oppgaveNavn }]}
      lessonScreenshots={imageUrl}
    ></ItemList>
  );
  expect(wrapper.contains(oppgaveNavn)).toEqual(true);
});
