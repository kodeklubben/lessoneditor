const languages = ["_nn", "_en", "_is", "_nb"];
const parseLessonFilename = (filename) => {
    let basename = filename;
    let lanuage = "nb";
    if (languages.includes(filename.slice(-3))) {
        basename = filename.slice(0, -3);
        lanuage = filename.slice(-2);
    }
    return {
        basename,
        lanuage,
    };
};

export default parseLessonFilename
