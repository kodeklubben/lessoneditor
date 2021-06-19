import loadUserLessons from "./load-user-lessons";


const isLessonSaved = async (username, course, title) => {
    const result = await loadUserLessons([username]);
    let lessonId = undefined;
    if (result) {
        const lessons = JSON.parse(result);
        lessons.forEach((lesson) => {
            if (course === lesson.course && title === lesson.lesson) {
                lessonId = lesson.lessonId;
            }
        });
    }
    return lessonId;
}

export default isLessonSaved
