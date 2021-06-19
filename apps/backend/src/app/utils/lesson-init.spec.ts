import lessonInit from "./lesson-init";

const dateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/;

it("should return new lesson instance", () => {
    const lessonData = {test: "test", test2: "test2"};
    const username = "user";
    const lesson = lessonInit(lessonData, username);

    expect(typeof lesson.lessonId).toBe("string");
    expect(lesson.lessonId).toHaveLength(7);
    expect(lesson.created).toMatch(dateRegex);
    expect(lesson.updated).toMatch(dateRegex);
    expect(lesson.createdBy).toBe(username);
});
