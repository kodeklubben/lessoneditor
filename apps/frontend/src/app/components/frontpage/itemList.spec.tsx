import Enzyme, {shallow} from "enzyme";
import ItemList from "./ItemList";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({adapter: new Adapter()});

it("renders without crashing", () => {
    const oppgaveNavn = "Min nye oppgave til kidsa";
    const imageUrl = ["url1", "url2"];
    const wrapper = shallow(
        <ItemList
            items={[{lesson: oppgaveNavn}]}
            lessonScreenshots={imageUrl}
        ></ItemList>
    );
    expect(wrapper.contains(oppgaveNavn)).toEqual(true);
});
