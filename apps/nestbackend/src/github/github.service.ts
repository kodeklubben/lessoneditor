import { Injectable, Inject, CACHE_MANAGER } from "@nestjs/common";
import { Cache } from "cache-manager";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import {} from "@octokit/core";
import { components } from "@octokit/openapi-types";
import { Lesson } from "../lesson/lesson.entity";
import { User } from "../user/user.entity";
import axios from "axios";
import * as yaml from "js-yaml";

interface UploadObject {
  path: string;
  buffer: Buffer;
}

interface UploadBlob {
  path: string;
  blob: RestEndpointMethodTypes["git"]["createBlob"]["response"]["data"];
}

@Injectable()
export class GithubService {
  octokit: Octokit;
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async submitLesson(user: User, accessToken: string, lesson: Lesson) {
    try {
      const accessToken = await this.cacheManager.get(user.userId.toString());
      this.octokit = new Octokit({ auth: accessToken });
    } catch (error) {
      console.error(error);
    }

    const { owner, repo, status } = await this.createFork(user);
    if (status !== 202) {
      return status;
    }
    if (!lesson.files) {
      console.warn("No lesson data files");
      return null;
    }

    const formatLessonData = lesson.files.map((file) => {
      if (file.ext === ".yml") {
        const newContent = yaml.dump(JSON.parse(file.content.toString()));
        return { ...file, content: Buffer.from(newContent, "utf-8") };
      } else if (file.ext === ".md") {
        const separator = "---\n";
        const textContent = file.content.toString();
        const [_, header, body] = textContent.split(separator);
        const headerData = yaml.load(header);
        const newHeaderData =
          headerData["translatorList"].length > 0
            ? {
                title: headerData["title"],
                author: headerData["authorList"].join(", "),
                translator: headerData["translatorList"].join(", "),
                language: headerData["language"],
              }
            : {
                title: headerData["title"],
                author: headerData["authorList"].join(", "),
                language: headerData["language"],
              };
        const newContent = ["", yaml.dump(newHeaderData), body].join(separator);
        return { ...file, content: Buffer.from(newContent, "utf-8") };
      } else {
        return file;
      }
    });

    lesson.files = formatLessonData;
    const lessonPath = ["src", lesson.courseSlug, lesson.courseTitle].join("/");

    const filesToUpload: UploadObject[] = [];
    lesson.files.forEach((file) => {
      const path = [lessonPath, file.filename + file.ext].join("/");
      if (file.ext === ".yml") {
        filesToUpload.push({
          path,
          buffer: Buffer.from(file.content),
        });
      } else if (file.ext === ".md") {
        filesToUpload.push({
          path,
          buffer: Buffer.from(file.content.toString()),
        });
      } else if ([".jpg", ".jpeg", ".gif", ".png"].includes(file.ext)) {
        if (file.filename === "preview" && file.ext === ".png") {
          return;
        }
        filesToUpload.push({
          path,
          buffer: Buffer.from(file.content),
        });
      }
    });
    const branchName = lesson.lessonId.toString();
    const branch = await this.ensureBranch(owner, repo, branchName);
    const filesToUpdate = await this.getChangedFilesList(owner, repo, branchName, filesToUpload);
    const uploadBlobs: Promise<UploadBlob>[] = [];
    uploadBlobs.push(...filesToUpdate.map(this.createBlobForFile(owner, repo)));
    const uploadBlobResults = await Promise.all(uploadBlobs);
    const newTree = await this.createNewTree(owner, repo, uploadBlobResults, branch.commit.sha);
    const commitMessage = `My commit message`;
    const newCommit = await this.createNewCommit(
      owner,
      repo,
      commitMessage,
      newTree.sha,
      branch.commit.sha
    );
    try {
      await this.setBranchToCommit(owner, repo, branchName, newCommit.sha);
      await this.createPullRequest(
        owner,
        "New lesson",
        branchName,
        "Pull request from lesson editor"
      );
    } catch (error) {
      console.error(error);
    }
  }

  async createFork(user: User) {
    try {
      const response = await this.octokit.request("GET /users/{username}/repos", {
        username: user.username,
      });
      const alreadyForked = response.data.find(
        (item) =>
          item.fork &&
          item.owner.login == process.env.GITHUB_LESSON_REPO_OWNER &&
          item.name == process.env.GITHUB_LESSON_REPO
      );
      if (alreadyForked) {
        return {
          status: true,
          owner: process.env.GITHUB_LESSON_REPO_OWNER,
          repo: process.env.GITHUB_LESSON_REPO,
        };
      } else {
        const forkResponse = await this.octokit.repos.createFork({
          owner: process.env.GITHUB_LESSON_REPO_OWNER,
          repo: process.env.GITHUB_LESSON_REPO,
        });
        return {
          status: forkResponse.status,
          owner: forkResponse.data.owner.login,
          repo: forkResponse.data.name,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getBranchCached(
    owner,
    repo,
    branch
  ): Promise<components["schemas"]["branch-with-protection"]> {
    const cacheKey = JSON.stringify({ owner, repo, branch });
    const value = await this.cacheManager.get(cacheKey);
    if (value != null) {
      console.log("Getting branch from cache", cacheKey);
      return <components["schemas"]["branch-with-protection"]>value;
    } else {
      try {
        const branchInfo = await this.octokit.repos.getBranch({
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
  }

  async ensureBranch(owner, repo, branch) {
    const branchData = await this.getBranchCached(owner, repo, branch);
    if (branchData === null) {
      console.log("Branch is not existing, creating", { owner, repo, branch });
      const masterBranch = await this.getBranchCached(owner, repo, "master");

      await this.octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha: masterBranch.commit.sha,
      });
      return await this.getBranchCached(owner, repo, branch);
    } else {
      console.log("Branch exists", { owner, repo, branch });
      return branchData;
    }
  }

  async getChangedFilesList(
    owner: string,
    repo: string,
    branch: string,
    uploadObjects: UploadObject[]
  ): Promise<UploadObject[]> {
    const filteredObjects: Promise<UploadObject>[] = [];
    filteredObjects.push(
      ...uploadObjects.map(async (object) => {
        if (!object.buffer) {
          console.debug("No update for " + object.path + ", buffer is invalid.");
          return null;
        }
        await this.ensureBranch(owner, repo, branch);
        const fileContent: any = await this.getContentCached(owner, repo, branch, object.path);
        if (fileContent) {
          // just to a quick comparision to avoid updating files that are actually the same.
          const x = Buffer.compare(Buffer.from(fileContent.content, "base64"), object.buffer);
          if (x === 0) {
            console.debug("No update for " + object.path + " content is equal.");
            return null;
          } else {
            return object;
          }
        }
        return object;
      })
    );
    const filteredObjectsResult = await Promise.all(filteredObjects);
    return filteredObjectsResult.filter((object) => object != null);
  }

  async getContentCached(owner, repo, ref, path) {
    try {
      const response = await this.octokit.repos.getContent({
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

  resolveMarkdownImageUrls(markdownContent: string) {
    return markdownContent.replace(
      /(!\[.*?\]\()(.+?)(\))/gs,
      function (whole, prefix, imagePathRaw, postfix) {
        const imageName = imagePathRaw.split("/").pop().replace(/\s/g, "");
        return prefix + imageName + postfix;
      }
    );
  }

  getMarkdownUrlsSubmit(markdownContent: string) {
    const images = [];
    const matches = [...markdownContent.matchAll(/(!\[.*?\]\()(.+?)(\))/gs)];
    matches.map((match) => {
      const imagePathRaw = match[2];
      const imageName = imagePathRaw.split("/").pop();
      images.push({ name: imageName, url: imagePathRaw });
    });
    return images;
  }

  async downloadImage(url) {
    try {
      const response = await axios.get<ArrayBuffer>(url, {
        responseType: "arraybuffer",
      });
      return Buffer.from(response.data);
    } catch (e) {
      return null;
    }
  }

  async createPullRequest(username, title, branch, body) {
    try {
      console.log("Creating pull request.");
      return await this.octokit.pulls.create({
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
  }

  createBlobForFile =
    (owner: string, repo: string) =>
    async (uploadbject: UploadObject): Promise<UploadBlob> => {
      const ext = uploadbject.path.split(".").pop();
      if (["jpg", "jpeg", "gif", "png"].includes(ext)) {
        const blobData: RestEndpointMethodTypes["git"]["createBlob"]["response"] =
          await this.octokit.git.createBlob({
            owner: owner,
            repo: repo,
            content: uploadbject.buffer.toString("base64"),
            encoding: "base64",
          });
        const uploadBlob: UploadBlob = {
          path: uploadbject.path,
          blob: blobData.data,
        };
        return uploadBlob;
      } else {
        const blobData: RestEndpointMethodTypes["git"]["createBlob"]["response"] =
          await this.octokit.git.createBlob({
            owner: owner,
            repo: repo,
            content: uploadbject.buffer.toString(),
            encoding: "utf-8",
          });
        const uploadBlob: UploadBlob = {
          path: uploadbject.path,
          blob: blobData.data,
        };
        return uploadBlob;
      }
    };
  setBranchToCommit = (org: string, repo: string, branch = `master`, commitSha: string) =>
    this.octokit.git.updateRef({
      owner: org,
      repo,
      ref: `heads/${branch}`,
      sha: commitSha,
    });

  createNewCommit = async (
    org: string,
    repo: string,
    message: string,
    currentTreeSha: string,
    currentCommitSha: string
  ) =>
    (
      await this.octokit.git.createCommit({
        owner: org,
        repo,
        message,
        tree: currentTreeSha,
        parents: [currentCommitSha],
      })
    ).data;

  createNewTree = async (
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
    })) as RestEndpointMethodTypes["git"]["createTree"]["parameters"]["tree"];
    const { data } = await this.octokit.git.createTree({
      owner,
      repo,
      tree,
      base_tree: parentTreeSha,
    });
    return data;
  };
}
