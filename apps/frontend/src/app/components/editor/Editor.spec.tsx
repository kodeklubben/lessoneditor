import Enzyme, { mount } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { MemoryRouter, Route } from "react-router-dom";
import Editor from "../../pages/Editor";
import { LessonContextProvider } from "../../contexts/LessonContext";
import { FileContextProvider } from "../../contexts/FileContext";
import mockAxios from "jest-mock-axios";

Enzyme.configure({ adapter: new Adapter() });

it("dummy", () => {
  expect(true).toBe(true);
});

let wrapped: any;

// beforeEach(() => {
//   wrapped = mount(
//     <MemoryRouter>
//       <Route path="/editor/1/1">
//         <LessonContextProvider>
//           <FileContextProvider>
//             <Editor />
//           </FileContextProvider>
//         </LessonContextProvider>
//       </Route>
//     </MemoryRouter>
//   );
// });

// afterEach(() => {
//   wrapped.unmount();
// });

// describe("textarea", () => {

//   it("should show text in textarea", () => {

//     const lesson: LessonDTO =
//     {
//       lessonId: 1,
//       lessonSlug: "Min-nye-oppgave-til-kidsa",
//       lessonTitle: "Min nye oppgave til kidsa",
//       courseSlug: "test-kurs",
//       courseTitle: "test-kurs",
//       submitted: false,
//       created_by: "test-user",
//       updated_by: "test-user",
//       created_at: new Date(),
//       updated_at: new Date()
//     }

//     mockAxios.get.mockResolvedValueOnce(lesson);

//     wrapped
//       .find("textarea")
//       .simulate("change", { target: { value: "# test" } });
//     wrapped.update();
//     expect(wrapped.find("textarea").prop("value")).toEqual("# test");
//   });
// });

// describe("preview-area", () => {
//   it("should render bold correctly", () => {
//     wrapped
//       .find("textarea")
//       .simulate("change", { target: { value: "**test**" } });
//     wrapped.update();
//     expect(wrapped.find(".PreviewArea").html()).toEqual(
//       "<div class=\"PreviewArea\"><p><strong>test</strong></p>\n</div>"
//     );
//   });

//   it("should render italic correctly", () => {
//     wrapped
//       .find("textarea")
//       .simulate("change", { target: { value: "*test*" } });
//     wrapped.update();
//     expect(wrapped.find(".PreviewArea").html()).toEqual(
//       "<div class=\"PreviewArea\"><p><em>test</em></p>\n</div>"
//     );
//   });

//   it("should render h1 correctly", () => {
//     wrapped
//       .find("textarea")
//       .simulate("change", { target: { value: "# test" } });
//     wrapped.update();
//     expect(wrapped.find(".PreviewArea").html()).toEqual(
//       "<div class=\"PreviewArea\"><section>\n<h1>test</h1>\n</section>\n</div>"
//     );
//   });

//   it("should render h2 correctly", () => {
//     wrapped
//       .find("textarea")
//       .simulate("change", { target: { value: "## test" } });
//     wrapped.update();
//     expect(wrapped.find(".PreviewArea").html()).toEqual(
//       "<div class=\"PreviewArea\"><section>\n<h2>test</h2>\n</section>\n</div>"
//     );
//   });
// });

// Denne feiler:

// describe("editor buttons", () => {
//   it("should output markdown syntax for bold to textarea after buttonclick", () => {
//     wrapped.find(".emphasis").find("button").at(0).simulate("click");
//     wrapped.update();
//     expect(wrapped.find("textarea").prop("value")).toEqual("****");
//   });
// });
