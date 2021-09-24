import { Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import {Cache} from "cache-manager"
import {Octokit} from "@octokit/rest"
import {components} from "@octokit/openapi-types"
import {Lesson} from "../../../lesson/src/lib/lesson.entity"

@Injectable()
export class GithubService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache)
    {}

    async submitLesson(token, lesson: Lesson){
        const {owner} = await this.createFork(token);
        await this.updateLesson(token, lesson, lesson.lessonId);
        // if (false) {
        //     return await createPullRequest(
        //         token,
        //         owner,
        //         title,
        //         branchName,
        //         "Pull request from lesson editor"
        //     );
        // } else {
            return {
                status: 201,
                data: {
                    html: "http://example.com/example-url",
                },
            };
    };



    async getRepoContent(path){
        const octokit = new Octokit();
        try {
            return await octokit.repos.getContent({
                owner: process.env.GITHUB_LESSON_REPO_OWNER,
                repo: process.env.GITHUB_LESSON_REPO,
                path: path,
            });
        } catch {
            console.log(`Path not found: ${path}`);
            return null;
        }
    }

    async createFork(token){
        const octokit = new Octokit({auth: token});
        const forkResponse = await octokit.repos.createFork({
            owner: process.env.GITHUB_LESSON_REPO_OWNER,
            repo: process.env.GITHUB_LESSON_REPO,
        });
        return {
            status: forkResponse.status,
            owner: forkResponse.data.owner.login,
            repo: forkResponse.data.name,
        };
    }


    async getBranchCached(token, owner, repo, branch): Promise<components["schemas"]["branch-with-protection"]>{
        const cacheKey = JSON.stringify({owner, repo, branch});
        const value = await this.cacheManager.get(cacheKey)
        if (value != null) {
            console.log("Getting branch from cache", cacheKey);
            return <components["schemas"]["branch-with-protection"]> value
        } else {
            try {
                const octokit = new Octokit({auth: token});
                const branchInfo = await octokit.repos.getBranch({
                    owner,
                    repo,
                    branch,
                });
                console.log("Branch fetched, should caching the result", cacheKey);
                this.cacheManager.set(cacheKey, branchInfo.data);
                return await this.cacheManager.get(cacheKey);
            } catch (e) {
                if (e.status === 404) {
                    console.log("Couldn't find branch", cacheKey);
                    return null;
                } else {
                    throw e;
                }
            }
        }
    };

    async ensureBranch(token, owner, repo, branch){
        const branchData = await this.getBranchCached(token, owner, repo, branch);
        if (branchData === null) {
            console.log("Branch is not existing, creating", {owner, repo, branch});
            const masterBranch = await this.getBranchCached(token, owner, repo, "master");
            const octokit = new Octokit({auth: token});
            await octokit.git.createRef({
                owner,
                repo,
                ref: `refs/heads/${branch}`,
                sha: masterBranch.commit.sha,
            });
            return await this.getBranchCached(token, owner, repo, branch);
        } else {
            console.log("Branch exists", {owner, repo, branch});
            return branchData;
        }
    };

    async updateLesson(token, lesson: Lesson, branchName){
        const {owner, repo, status} = await this.createFork(token);
        if (status !== 202) {
            return status;
        }
        if (!lesson.files) {
            console.warn("No lesson data files");
            return null;
        }
    
        const lessonPath = ["src", lesson.courseSlug, lesson.courseTitle].join("/");
    
        const filesToUpload = [];
        const filesToDownload = [];
        lesson.files.forEach((file) => {
            const path = [lessonPath, file.filename].join("/");
            if (file.ext === "yml") {
                filesToUpload.push({
                    path,
                    buffer: Buffer.from(file.content),
                });
            } else if (file.ext === "md") {
                 const markdownContent = this.resolveMarkdownImageUrls(file.content);
                filesToUpload.push({
                    path,
                    buffer: Buffer.from(markdownContent),
                });
                // filesToDownload.push(
                //     ...getMarkdownUrlsSubmit(file.content).map(async (imgFile) => {
                //         filesToUpload.push({
                //             path: [lessonPath, imgFile.name].join("/"),
                //             buffer: await downloadImage(imgFile.url),
                //         });
                //     })
                // );
            }
        });
        await Promise.all(filesToDownload);
        await this.ensureBranch(token, owner, repo, branchName);
        const uploadPromises = filesToUpload.map(
            async (file) =>
                await this.upsertFile(token, owner, repo, branchName, file.path, file.buffer)
        );
        console.log("stating uploading", uploadPromises);
        await Promise.all(uploadPromises);
        console.log("done uploading");
    };

    async upsertFile(token, owner, repo, branch, path, buffer){
        if (!buffer) {
            console.debug("No update for " + path + ", buffer is invalid.");
            return null;
        }
        await this.ensureBranch(token, owner, repo, branch);
        const fileContent: any  = await this.getContentCached(token, owner, repo, branch, path);
        fileContent.toLocaleString
        const octokit = new Octokit({auth: token});
        const content = buffer.toString("base64");
        if (fileContent) {
            // just to a quick comparision to avoid updating files that are actually the same.
            const x = Buffer.compare(
                Buffer.from(fileContent.content, "base64"),
                buffer
            );
            if (x === 0) {
                console.debug("No update for " + path + " content is equal.");
                return null;
            } else {
                const message = "Updates " + path + " with lessoneditor.";
                console.debug(message);
                return await octokit.repos.createOrUpdateFileContents({
                    owner,
                    repo,
                    path,
                    branch,
                    message,
                    content,
                    sha: fileContent.sha,
                });
            }
        } else {
            const message = "Creating " + path + " with lessoneditor.";
            console.log(message, path);
            return await octokit.repos
                .createOrUpdateFileContents({
                    owner,
                    repo,
                    path,
                    branch,
                    message,
                    content,
                })
                .catch((e) => {
                    console.log(e);
                    process.exit(1);
                    console.error(e.message, path);
                });
        }
    };
    
    async getContentCached(token, owner, repo, ref, path) {
        const octokit = new Octokit({auth: token});
        try {
            const response = await octokit.repos.getContent({
                owner,
                repo,
                path,
                ref,
            });
            return response.data;
        } catch (e) {
            if (e.status === 404) {
                return null;
            } else {
                throw e;
            }
        }
        return;
    }

    resolveMarkdownImageUrls(markdownContent){
        return markdownContent.replace(/(!\[.*?\]\()(.+?)(\))/gs, function (
            whole,
            prefix,
            imagePathRaw,
            postfix
        ) {
            const imageName = imagePathRaw.split("/").pop().replace(/\s/g, "");
            return prefix + imageName + postfix;
        });
    };
}
