import { Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import {Cache} from "cache-manager"
import {Octokit, RestEndpointMethodTypes} from "@octokit/rest"
import {} from "@octokit/core"
import {components} from "@octokit/openapi-types"
import {FileStore, Lesson} from "../../../lesson/src/lib/lesson.entity"
import * as jwt from "jsonwebtoken"
import { createTokenAuth } from "@octokit/auth-token";
import axios from "axios";

interface UploadObject
{
    path: string,
    buffer: Buffer
}

interface UploadBlob
{
    path: string,
    blob: RestEndpointMethodTypes["git"]["createBlob"]["response"]["data"]
}


const octokit = new Octokit({auth: "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"})

@Injectable()
export class GithubService {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache)
    {}

    async submitLesson(lesson: Lesson)
    {
        const {owner, repo, status} = await this.createFork();
        if (status !== 202) {
            return status;
        }
        if (!lesson.files) {
            console.warn("No lesson data files");
            return null;
        }
        const lessonPath = ["src", lesson.courseSlug, lesson.courseTitle].join("/");
    
        const filesToUpload: UploadObject[] = [];
        const filesToDownload: Promise<void>[] = [];
        lesson.files.forEach((file) => {
            const path = [lessonPath, file.filename + "." + file.ext].join("/");
            if (file.ext === "yml") {
                filesToUpload.push({
                    path,
                    buffer: file.content,
                });
            } else if (file.ext === "md") {
                 const markdownContent = this.resolveMarkdownImageUrls(file.content.toString());
                filesToUpload.push({
                    path,
                    buffer: Buffer.from(markdownContent),
                });
                filesToDownload.push(
                    ...this.getMarkdownUrlsSubmit(file.content.toString()).map(async (imgFile) => {
                        filesToUpload.push({
                            path: [lessonPath, imgFile.name].join("/"),
                            buffer: await this.downloadImage(imgFile.url),
                        });
                    })
                );
            }
        });
        const branchName = lesson.lessonId.toString()
        await Promise.all(filesToDownload);
        const branch = await this.ensureBranch(owner, repo, branchName);
        const filesToUpdate = await this.getChangedFilesList(owner, repo, branchName,filesToUpload)
        
        const uploadBlobs: Promise<UploadBlob>[] = []
        uploadBlobs.push(
            ...filesToUpdate.map(createBlobForFile(owner, repo))
        )
        const uploadBlobResults = await Promise.all(uploadBlobs)
        const newTree = await createNewTree(owner, repo,uploadBlobResults, branch.commit.sha)
        const commitMessage = `My commit message`
        const newCommit = await createNewCommit(
            owner,
            repo,
            commitMessage,
            newTree.sha,
            branch.commit.sha
        )
        await setBranchToCommit(owner, repo, branchName, newCommit.sha)
         if (false) {
                return await this.createPullRequest(
                    owner,
                    "New lesson",
                    branchName,
                    "Pull request from lesson editor"
                );
            }

    }

    async createFork(){
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

    async getBranchCached(owner, repo, branch): Promise<components["schemas"]["branch-with-protection"]>{
        const cacheKey = JSON.stringify({owner, repo, branch});
        const value = await this.cacheManager.get(cacheKey)
        if (value != null) {
            console.log("Getting branch from cache", cacheKey);
            return <components["schemas"]["branch-with-protection"]> value
        } else {
            try {
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

    async ensureBranch(owner, repo, branch){
        const branchData = await this.getBranchCached(owner, repo, branch);
        if (branchData === null) {
            console.log("Branch is not existing, creating", {owner, repo, branch});
            const masterBranch = await this.getBranchCached(owner, repo, "master");
   
            await octokit.git.createRef({
                owner,
                repo,
                ref: `refs/heads/${branch}`,
                sha: masterBranch.commit.sha,
            });
            return await this.getBranchCached(owner, repo, branch);
        } else {
            console.log("Branch exists", {owner, repo, branch});
            return branchData;
        }
    };

    async getChangedFilesList(owner:string, repo: string, branch:string, uploadObjects: UploadObject[]): Promise<UploadObject[]>
    {
        const filteredObjects: Promise<UploadObject>[] = []
        filteredObjects.push(
            ...uploadObjects.map(async object => {
                if (!object.buffer) {
                    console.debug("No update for " + object.path + ", buffer is invalid.");
                    return null;
                }
                await this.ensureBranch(owner, repo, branch);
                const fileContent: any  = await this.getContentCached( owner, repo, branch, object.path);
                if (fileContent) {
                    // just to a quick comparision to avoid updating files that are actually the same.
                    const x = Buffer.compare(
                        Buffer.from(fileContent.content, "base64"),
                        object.buffer
                    );
                    if (x === 0) {
                        console.debug("No update for " + object.path + " content is equal.");
                        return null;
                    } else {
                        return object
                    }
                }
                return object
            })
        )
        const filteredObjectsResult = await Promise.all(filteredObjects)
        return filteredObjectsResult.filter(object  => object!= null)
    }

    async getContentCached(owner, repo, ref, path) {
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

    resolveMarkdownImageUrls(markdownContent: string){
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

    getMarkdownUrlsSubmit(markdownContent: string){
        const images = [];
        const matches = [...markdownContent.matchAll(/(!\[.*?\]\()(.+?)(\))/gs)];
        matches.map((match) => {
            const imagePathRaw = match[2];
            const imageName = imagePathRaw.split("/").pop();
            images.push({name: imageName, url: imagePathRaw});
        });
        return images;
    };

    async downloadImage(url){
        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer",
            });
            return Buffer.from(response.data, "binary");
        } catch (e) {
            return null;
        }
    };

    async createPullRequest(username, title, branch, body){
        try {
            
            console.log("Creating pull request.");
            return await octokit.pulls.create({
                owner: process.env.GITHUB_LESSON_REPO_OWNER,
                repo: process.env.GITHUB_LESSON_REPO,
                title: title, // title of PR
                head: `${username}:${branch}`,
                base: "master",
                body: body, // PR message
            });
        } catch (e) {
            if (e.status === 422) {
                console.log("Pull request already exists.");
                return e;
            } else {
                throw e;
            }
        }
    };
}


const createBlobForFile = (owner: string, repo:string) => async (uploadbject: UploadObject): Promise<UploadBlob> => 
{
    const ext = uploadbject.path.split(".").pop()
    if(ext == "png" || ext =="jpg")
    {
        const blobData: RestEndpointMethodTypes["git"]["createBlob"]["response"] = await octokit.git.createBlob({
            owner: owner,
            repo: repo,
            content: uploadbject.buffer.toString(),
            encoding: 'base64',
          })
          const uploadBlob: UploadBlob = {
            path: uploadbject.path,
            blob: blobData.data
          }
        return uploadBlob
    }
    else
    {
        const blobData: RestEndpointMethodTypes["git"]["createBlob"]["response"] = await octokit.git.createBlob({
            owner: owner,
            repo: repo,
            content: uploadbject.buffer.toString(),
            encoding: 'utf-8',
          })
          const uploadBlob: UploadBlob = {
            path: uploadbject.path,
            blob: blobData.data
          }
        return uploadBlob
    }
}

const setBranchToCommit = (
    org: string,
    repo: string,
    branch: string = `master`,
    commitSha: string
  ) =>
    octokit.git.updateRef({
      owner: org,
      repo,
      ref: `heads/${branch}`,
      sha: commitSha,
    })

const createNewCommit = async (
    org: string,
    repo: string,
    message: string,
    currentTreeSha: string,
    currentCommitSha: string
  ) =>
    (await octokit.git.createCommit({
      owner: org,
      repo,
      message,
      tree: currentTreeSha,
      parents: [currentCommitSha],
    })).data

const createNewTree = async (

    owner: string,
    repo: string,
    uploadBlobs: UploadBlob[],
    parentTreeSha: string
  ) => {
    // My custom config. Could be taken as parameters
    const tree = uploadBlobs.map(({ blob, path }, index) => ({
      path: path,
      mode: `100644`,
      type: `blob`,
      sha: blob.sha,
    })) as RestEndpointMethodTypes["git"]["createTree"]["parameters"]["tree"]
    const { data } = await octokit.git.createTree({
      owner,
      repo,
      tree,
      base_tree: parentTreeSha,
    })
    return data
  }
