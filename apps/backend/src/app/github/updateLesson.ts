import getMarkdownUrlsSubmit from "../utils/get-markdown-urls-submit";
import upsertFile from "./upsertFile";
import createFork from "./createFork";
import resolveMarkdownImageUrls from "../utils/resolve-markdown-image-urls";
import downloadImage from "../storage/download-image";
import ensureBranch from "./ensureBranch";


const updateLesson = async (token, lessonData, branchName) => {
    const {owner, repo, status} = await createFork(token);
    if (status !== 202) {
        return status;
    }
    const {files} = lessonData;
    const {course, title} = lessonData.meta;
    if (!files) {
        console.warn("No lesson data files");
        return null;
    }

    const lessonPath = ["src", course, title].join("/");

    const filesToUpload = [];
    const filesToDownload = [];
    files.forEach((file) => {
        const path = [lessonPath, file.filename].join("/");
        if (file.ext === "yml") {
            filesToUpload.push({
                path,
                buffer: Buffer.from(file.content),
            });
        } else if (file.ext === "md") {
            const markdownContent = resolveMarkdownImageUrls(file.content);
            filesToUpload.push({
                path,
                buffer: Buffer.from(markdownContent),
            });
            filesToDownload.push(
                ...getMarkdownUrlsSubmit(file.content).map(async (imgFile) => {
                    filesToUpload.push({
                        path: [lessonPath, imgFile.name].join("/"),
                        buffer: await downloadImage(imgFile.url),
                    });
                })
            );
        }
    });
    await Promise.all(filesToDownload);
    await ensureBranch(token, owner, repo, branchName);
    const uploadPromises = filesToUpload.map(
        async (file) =>
            await upsertFile(token, owner, repo, branchName, file.path, file.buffer)
    );
    console.log("stating uploading", uploadPromises);
    await Promise.all(uploadPromises);
    console.log("done uploading");
};

export default updateLesson
