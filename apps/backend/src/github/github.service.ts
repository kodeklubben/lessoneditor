import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from "@nestjs/common";
import { isCourseSlug, isLessonSlug } from "../../../../libs/contracts/src/lib/validation";
import { Octokit, RestEndpointMethodTypes } from "@octokit/rest";
import {} from "@octokit/core";
import { components } from "@octokit/openapi-types";
import { Lesson } from "../lesson/lesson.entity";
import { User } from "../user/user.entity";
import axios from "axios";
import { buildUploadFiles, UploadObject } from "./submission-files";

interface UploadBlob {
  path: string;
  blob: RestEndpointMethodTypes["git"]["createBlob"]["response"]["data"];
}

@Injectable()
export class GithubService {
  /** A new client per submission: a shared instance mixed up tokens between concurrent users. */
  createClient(accessToken: string): Octokit {
    return new Octokit({ auth: accessToken });
  }

  async submitLesson(
    user: User,
    accessToken: string,
    lesson: Lesson,
    submitMessage: { message: string },
  ) {
    if (process.env.DISABLE_PULL_REQUESTS !== "false") {
      throw new ForbiddenException("GitHub submission is disabled in this environment");
    }
    if (!accessToken) {
      throw new UnauthorizedException("Missing GitHub authorization");
    }
    // Checked again here: older rows were stored before slugs were validated.
    if (!isCourseSlug(lesson.courseSlug) || !isLessonSlug(lesson.lessonSlug)) {
      throw new BadRequestException("The lesson or course slug cannot be used as a path");
    }
    const octokit = this.createClient(accessToken);
    const { owner, repo, status } = await this.createFork(octokit, user);
    if (status !== 202 && status !== 201) {
      throw new Error("GitHub fork is not ready");
    }
    if (!lesson.files) {
      throw new Error("No lesson data files");
    }

    const filesToUpload = buildUploadFiles(lesson, lesson.files);
    const branchName = lesson.lessonId.toString();
    const branch = await this.ensureBranch(octokit, owner, repo, branchName);
    const filesToUpdate = await this.getChangedFilesList(
      octokit,
      owner,
      repo,
      branchName,
      filesToUpload,
    );
    const uploadBlobs: Promise<UploadBlob>[] = [];
    uploadBlobs.push(...filesToUpdate.map(this.createBlobForFile(octokit, owner, repo)));
    const uploadBlobResults = await Promise.all(uploadBlobs);
    const newTree = await this.createNewTree(
      octokit,
      owner,
      repo,
      uploadBlobResults,
      branch.commit.sha,
    );
    const commitMessage = `Pull request from lesson editor`;
    const newCommit = await this.createNewCommit(
      octokit,
      owner,
      repo,
      commitMessage,
      newTree.sha,
      branch.commit.sha,
    );
    await this.setBranchToCommit(octokit, owner, repo, branchName, newCommit.sha);
    await this.createPullRequest(
      octokit,
      owner,
      lesson.lessonTitle,
      branchName,
      submitMessage.message,
    );
  }

  async createFork(octokit: Octokit, user: User) {
    try {
      const response = await octokit.request("GET /users/{username}/repos", {
        username: user.username,
      });

      const alreadyForked = response.data.find(
        (item) =>
          item.fork &&
          item.owner.login === process.env.GH_LESSON_REPO_OWNER &&
          item.name === process.env.GH_LESSON_REPO,
      );

      if (alreadyForked) {
        console.log("Repository already forked. Using the existing fork.");
        return {
          status: 201, // This status indicates that the fork already exists.
          owner: alreadyForked.owner.login,
          repo: alreadyForked.name,
        };
      } else {
        const forkResponse = await octokit.repos.createFork({
          owner: process.env.GH_LESSON_REPO_OWNER,
          repo: process.env.GH_LESSON_REPO,
        });

        // Adding a delay to ensure fork is ready for subsequent operations.
        await new Promise((resolve) => setTimeout(resolve, 5000));

        return {
          status: forkResponse.status,
          owner: forkResponse.data.owner.login,
          repo: forkResponse.data.name,
        };
      }
    } catch (error) {
      console.error("Error creating fork:", error);
      throw error; // Throw the error to be handled by the caller or higher-level error handler.
    }
  }

  /** Always asks GitHub: a cached branch head went stale after the first push. */
  async getBranch(
    octokit: Octokit,
    owner: string,
    repo: string,
    branch: string,
  ): Promise<components["schemas"]["branch-with-protection"] | null> {
    try {
      return (await octokit.repos.getBranch({ owner, repo, branch })).data;
    } catch (e) {
      if (e.status === 404) return null;
      throw e;
    }
  }

  async ensureBranch(octokit: Octokit, owner, repo, branch) {
    const branchData = await this.getBranch(octokit, owner, repo, branch);
    if (branchData === null) {
      console.log("Branch is not existing, creating", { owner, repo, branch });
      const masterBranch = await this.getBranch(octokit, owner, repo, "master");

      await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha: masterBranch.commit.sha,
      });
      return await this.getBranch(octokit, owner, repo, branch);
    } else {
      console.log("Branch exists", { owner, repo, branch });
      return branchData;
    }
  }

  async getChangedFilesList(
    octokit: Octokit,
    owner: string,
    repo: string,
    branch: string,
    uploadObjects: UploadObject[],
  ): Promise<UploadObject[]> {
    const filteredObjects: Promise<UploadObject>[] = [];
    filteredObjects.push(
      ...uploadObjects.map(async (object) => {
        if (!object.buffer) {
          console.debug("No update for " + object.path + ", buffer is invalid.");
          return null;
        }
        await this.ensureBranch(octokit, owner, repo, branch);
        const fileContent: any = await this.getContentCached(
          octokit,
          owner,
          repo,
          branch,
          object.path,
        );
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
      }),
    );
    const filteredObjectsResult = await Promise.all(filteredObjects);
    return filteredObjectsResult.filter((object) => object != null);
  }

  async getContentCached(octokit: Octokit, owner: string, repo: string, ref: string, path: string) {
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
  }

  resolveMarkdownImageUrls(markdownContent: string) {
    return markdownContent.replace(
      /(!\[.*?\]\()(.+?)(\))/g,
      function (whole, prefix, imagePathRaw, postfix) {
        const imageName = imagePathRaw.split("/").pop().replace(/\s/g, "");
        return prefix + imageName + postfix;
      },
    );
  }

  getMarkdownUrlsSubmit(markdownContent: string) {
    const images = [];
    const matches = [...markdownContent.matchAll(/(!\[.*?\]\()(.+?)(\))/g)];
    matches.map((match) => {
      const imagePathRaw = match[2];
      const imageName = imagePathRaw.split("/").pop();
      images.push({ name: imageName, url: imagePathRaw });
    });
    return images;
  }

  async downloadImage(url: string) {
    try {
      const response = await axios.get<ArrayBuffer>(url, {
        responseType: "arraybuffer",
      });
      return Buffer.from(response.data);
    } catch (e) {
      console.error("Error downloading image:", e);
      return null;
    }
  }

  async createPullRequest(octokit: Octokit, username, title, branch, body) {
    const disablePullRequests = process.env.DISABLE_PULL_REQUESTS === "true";

    if (disablePullRequests) {
      console.log("Pull requests are disabled.");
      return null;
    }
    try {
      console.log("Creating pull request.");
      return await octokit.pulls.create({
        owner: process.env.GH_LESSON_REPO_OWNER,
        repo: process.env.GH_LESSON_REPO,
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
    (octokit: Octokit, owner: string, repo: string) =>
    async (uploadbject: UploadObject): Promise<UploadBlob> => {
      const ext = uploadbject.path.split(".").pop();
      if (["jpg", "jpeg", "gif", "png"].includes(ext)) {
        const blobData: RestEndpointMethodTypes["git"]["createBlob"]["response"] =
          await octokit.git.createBlob({
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
          await octokit.git.createBlob({
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
  setBranchToCommit = (
    octokit: Octokit,
    org: string,
    repo: string,
    branch: string,
    commitSha: string,
  ) =>
    octokit.git.updateRef({
      owner: org,
      repo,
      ref: `heads/${branch}`,
      sha: commitSha,
    });

  createNewCommit = async (
    octokit: Octokit,
    org: string,
    repo: string,
    message: string,
    currentTreeSha: string,
    currentCommitSha: string,
  ) =>
    (
      await octokit.git.createCommit({
        owner: org,
        repo,
        message,
        tree: currentTreeSha,
        parents: [currentCommitSha],
      })
    ).data;

  createNewTree = async (
    octokit: Octokit,
    owner: string,
    repo: string,
    uploadBlobs: UploadBlob[],
    parentTreeSha: string,
  ) => {
    // My custom config. Could be taken as parameters
    const tree = uploadBlobs.map(({ blob, path }, index) => ({
      path: path,
      mode: `100644`,
      type: `blob`,
      sha: blob.sha,
    })) as RestEndpointMethodTypes["git"]["createTree"]["parameters"]["tree"];
    const { data } = await octokit.git.createTree({
      owner,
      repo,
      tree,
      base_tree: parentTreeSha,
    });
    return data;
  };
}
