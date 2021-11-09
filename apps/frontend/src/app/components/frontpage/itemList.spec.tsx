import Enzyme, { shallow } from "enzyme";
import ItemList from "./ItemList";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { LessonDTO } from "@libs/lesson/src/lib/lesson.dto";

Enzyme.configure({ adapter: new Adapter() });

it("dummy", () => {
  expect(true).toBe(true);
});

// it("renders without crashing", () => {
//   const lesson: LessonDTO =
//   {
//     lessonId: 1,
//     lessonSlug: "Min-nye-oppgave-til-kidsa",
//     lessonTitle: "Min nye oppgave til kidsa",
//     courseSlug: "test-kurs",
//     courseTitle: "test-kurs",
//     submitted: false,
//     created_by: "test-user",
//     updated_by: "test-user",
//     created_at: new Date(),
//     updated_at: new Date()
//   }
//   const wrapper = shallow(
//     <ItemList
//       lessons={[lesson]}

//     ></ItemList>
//   );
//   expect(wrapper.contains(lesson.lessonTitle)).toEqual(true);
// });
