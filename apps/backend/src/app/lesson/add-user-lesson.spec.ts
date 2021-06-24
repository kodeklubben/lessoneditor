import addUserLesson from "./add-user-lesson";
import loadUserLessons from "./load-user-lessons";
import { nanoid } from "nanoid";

it("should add a lesson", async () => {
  const username = nanoid(15);
  await addUserLesson({}, username);
  const lessons = await loadUserLessons(username);
  expect(lessons.length).toBe(1);
});
