import { Injectable, Logger } from "@nestjs/common";
import { load } from "js-yaml";
import type { LessonCatalog, CatalogTag } from "@lessoneditor/contracts";
// Runtime code from the shared lib is imported by path: tsc does not rewrite the alias.
import { parseLessonMarkdown } from "../../../../libs/contracts/src/lib/frontmatter";
import { isCourseSlug } from "../../../../libs/contracts/src/lib/validation";
import { env } from "../app/env";
import { GithubService } from "../github/github.service";

type TagGroup = "topic" | "subject" | "grade";
const GROUPS: TagGroup[] = ["topic", "subject", "grade"];

/**
 * The courses and the topic/subject/grade tags as the lesson repo has them (#335), instead of
 * lists copied into the editor that drifted: the editor offered a course «lego» that has no
 * folder, and missed «command_line» and «learntomod». Read-only; one tree request with the
 * user's token, the files themselves from raw.githubusercontent, cached for an hour.
 */
@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);
  private cached: { at: number; value: LessonCatalog | null } | undefined;
  cacheMs = 60 * 60 * 1000;
  /** A failed read is tried again sooner than a good answer is refreshed. */
  failureCacheMs = 5 * 60 * 1000;

  constructor(private githubService: GithubService) {}

  async catalog(accessToken: string | undefined): Promise<LessonCatalog | null> {
    const age = this.cached ? Date.now() - this.cached.at : Infinity;
    if (this.cached && age < (this.cached.value ? this.cacheMs : this.failureCacheMs)) {
      return this.cached.value;
    }
    if (!accessToken) return this.cached?.value ?? null;
    let value: LessonCatalog | null;
    try {
      value = await this.read(accessToken);
    } catch (error) {
      this.logger.warn(`Could not read the lesson repo's catalog: ${(error as Error).message}`);
      value = this.cached?.value ?? null;
    }
    this.cached = { at: Date.now(), value };
    return value;
  }

  private async read(accessToken: string): Promise<LessonCatalog> {
    const owner = env("GH_LESSON_REPO_OWNER");
    const repo = env("GH_LESSON_REPO");
    const raw = (path: string) =>
      fetchText(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`);
    const octokit = this.githubService.createClient(accessToken);
    const { data: tree } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: "HEAD",
      recursive: "true",
    });
    const paths = new Set(tree.tree.map((entry) => entry.path ?? ""));
    const candidates = [...paths]
      .map((path) => /^src\/([^/]+)\/index\.md$/.exec(path)?.[1])
      .filter((course): course is string => !!course && isCourseSlug(course));

    const courses = (
      await Promise.all(
        candidates.map(async (course) => {
          const settings = paths.has(`src/${course}/course.yml`)
            ? ((load(await raw(`src/${course}/course.yml`)) ?? {}) as { isExternal?: boolean })
            : {};
          // A link to another site (Codecademy, Khan Academy …): nothing to write here.
          if (settings.isExternal) return null;
          const title = parseLessonMarkdown<{ title?: unknown }>(
            await raw(`src/${course}/index.md`),
          ).data.title;
          return {
            value: course,
            text: typeof title === "string" && title.trim() ? title.trim() : course,
          };
        }),
      )
    )
      .filter((course): course is { value: string; text: string } => course !== null)
      .sort((a, b) => a.text.localeCompare(b.text, "nb"));

    const keys = (load(await raw("filtertags/keys.yml")) ?? {}) as Record<string, unknown>;
    const names = (load(await raw("filtertags/translation_nb.yml")) ?? {}) as Record<
      string,
      { TAGS?: Record<string, { NAME?: unknown }> }
    >;
    const tags = (group: TagGroup): CatalogTag[] => {
      const values = Array.isArray(keys[group]) ? (keys[group] as unknown[]).map(String) : [];
      const list = values.map((value) => {
        const name = names[group]?.TAGS?.[value]?.NAME;
        return { value, name: typeof name === "string" && name ? name : value };
      });
      // Topics alphabetically, as the editor showed them; subjects and grades keep the repo's
      // order (grades run from preschool to upper secondary).
      return group === "topic" ? list.sort((a, b) => a.name.localeCompare(b.name, "nb")) : list;
    };
    const [topic, subject, grade] = GROUPS.map(tags);
    if (courses.length === 0 || topic.length === 0) throw new Error("Empty catalog");
    return { courses, topic, subject, grade };
  }
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error(`${response.status} for ${new URL(url).pathname}`);
  return response.text();
}
