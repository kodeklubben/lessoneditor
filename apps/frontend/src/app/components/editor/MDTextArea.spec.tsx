import MDTextArea from "./MDTextArea";
import Enzyme, {shallow} from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";

Enzyme.configure({adapter: new Adapter()});

it("should set textarea change", () => {
    const onChangeSpy = jest.fn();

    const wrapper = shallow(
        <MDTextArea setCursor={onChangeSpy} setMdText={onChangeSpy}/>
    );
    wrapper
        .find("textarea")
        .simulate("change", {target: {value: "testText"}});

    expect(onChangeSpy).toHaveBeenCalled();
});
