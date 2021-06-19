import createFork from "./createFork";
import updateLesson from "./updateLesson";
import createPullRequest from "./createPullRequest";



const submitLesson = async (token, lessonData) => {
    const {owner} = await createFork(token);
    const {title, lessonId} = lessonData.meta;
    const branchName = lessonId; //Todo: Better branch names.
    await updateLesson(token, lessonData, branchName);
    if (false) {
        return await createPullRequest(
            token,
            owner,
            title,
            branchName,
            "Pull request from lesson editor"
        );
    } else {
        return {
            status: 201,
            data: {
                html: "http://example.com/example-url",
            },
        };
    }
};

export default submitLesson
