import { Injectable, Logger } from "@nestjs/common";
import { load } from "js-yaml";
import type { CatalogLesson, LessonCatalog, CatalogTag } from "@lessoneditor/contracts";
// Runtime code from the shared lib is imported by path: tsc does not rewrite the alias.
import { parseLessonMarkdown } from "../../../../libs/contracts/src/lib/frontmatter";
import { isCourseSlug } from "../../../../libs/contracts/src/lib/validation";
import { splitTextName } from "../../../../libs/contracts/src/lib/files";
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

  private lessonsCached: { at: number; value: CatalogLesson[] } | undefined;
  private lessonsRequest: Promise<CatalogLesson[] | null> | undefined;
  private lessonsFailedAt = 0;

  constructor(private githubService: GithubService) {}

  /**
   * Every lesson in the repo's courses. Read once and kept for an hour; after that the old list
   * is answered at once while a new one is read in the background, so nobody waits for GitHub
   * twice. Readers at the same time share one read.
   */
  async lessons(accessToken: string | undefined): Promise<CatalogLesson[] | null> {
    const cached = this.lessonsCached;
    if (cached && Date.now() - cached.at < this.cacheMs) return cached.value;
    const canRead = !!accessToken && Date.now() - this.lessonsFailedAt > this.failureCacheMs;
    if (cached) {
      if (canRead) void this.readLessonsOnce(accessToken!);
      return cached.value;
    }
    return canRead ? this.readLessonsOnce(accessToken!) : null;
  }

  private readLessonsOnce(accessToken: string): Promise<CatalogLesson[] | null> {
    this.lessonsRequest ??= this.readLessons(accessToken)
      .then((value) => {
        this.lessonsCached = { at: Date.now(), value };
        return value;
      })
      .catch((error) => {
        this.logger.warn(`Could not read the lessons: ${error}`);
        this.lessonsFailedAt = Date.now();
        return this.lessonsCached?.value ?? null;
      })
      .finally(() => {
        this.lessonsRequest = undefined;
      });
    return this.lessonsRequest;
  }

  private async readLessons(accessToken: string): Promise<CatalogLesson[]> {
    const catalog = await this.catalog(accessToken);
    if (!catalog) throw new Error("No courses");
    const courseTitles = new Map(catalog.courses.map((course) => [course.value, course.text]));
    const owner = env("GH_LESSON_REPO_OWNER");
    const repo = env("GH_LESSON_REPO");
    const rawUrl = (path: string) =>
      `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`;
    const { data: tree } = await this.githubService
      .createClient(accessToken)
      .git.getTree({ owner, repo, tree_sha: "HEAD", recursive: "true" });
    const paths = new Set(tree.tree.map((entry) => entry.path ?? ""));

    // A lesson is a folder with a lesson.yml, in one of the courses one can write in.
    const folders = [...paths]
      .map((path) => /^src\/([^/]+)\/([^/]+)\/lesson\.yml$/.exec(path))
      .filter((match): match is RegExpExecArray => !!match && courseTitles.has(match[1]));
    const texts = new Map<string, string[]>();
    for (const path of paths) {
      const match = /^(src\/[^/]+\/[^/]+)\/([^/]+)\.md$/.exec(path);
      if (match) texts.set(match[1], [...(texts.get(match[1]) ?? []), match[2]]);
    }

    const lessons = await mapLimited(
      folders,
      32,
      async ([, course, slug]): Promise<CatalogLesson | null> => {
        const folder = `src/${course}/${slug}`;
        const names = texts.get(folder) ?? [];
        const lessonTexts = names.filter((name) => !/^README(_|$)/.test(name));
        if (lessonTexts.length === 0) return null;
        const languages = [...new Set(lessonTexts.map((name) => splitTextName(name).language))];
        languages.sort((a, b) => (a === "nb" ? -1 : b === "nb" ? 1 : a.localeCompare(b)));
        const main = lessonTexts.includes(slug)
          ? slug
          : (lessonTexts.find((name) => splitTextName(name).language === languages[0]) ??
            lessonTexts[0]);
        const [yml, head] = await Promise.all([
          fetchText(rawUrl(`${folder}/lesson.yml`)).catch(() => ""),
          // Only the start of the text: the title is in the front matter.
          fetchText(rawUrl(`${folder}/${main}.md`), 2048).catch(() => ""),
        ]);
        // A link to another site (code.org's puzzles): nothing to write in a copy.
        if (/^external:/m.test(frontMatter(head))) return null;
        const settings = (safeLoad(yml) ?? {}) as {
          level?: unknown;
          tags?: Partial<Record<TagGroup, unknown>>;
        };
        const list = (value: unknown) => (Array.isArray(value) ? value.map(String) : []);
        return {
          course,
          courseTitle: courseTitles.get(course)!,
          slug,
          text: main,
          title: frontMatterTitle(head) ?? slug,
          level: typeof settings.level === "number" ? settings.level : undefined,
          languages,
          teacherGuide: names.some((name) => /^README(_|$)/.test(name)),
          tags: {
            topic: list(settings.tags?.topic),
            subject: list(settings.tags?.subject),
            grade: list(settings.tags?.grade),
          },
          image: paths.has(`${folder}/${slug}.png`) ? `${folder}/${slug}.png` : undefined,
        };
      },
    );
    const result = lessons.filter((lesson): lesson is CatalogLesson => lesson !== null);
    if (result.length === 0) throw new Error("No lessons");
    return result.sort(
      (a, b) =>
        a.courseTitle.localeCompare(b.courseTitle, "nb") || a.title.localeCompare(b.title, "nb"),
    );
  }

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

const frontMatter = (text: string) => /^---\r?\n([\s\S]*?)(?:\r?\n---|$)/.exec(text)?.[1] ?? "";

/** The title from a text's front matter, also when only its first bytes were read. */
export function frontMatterTitle(text: string): string | undefined {
  const title = /^title:[ \t]*(.+?)[ \t]*$/m.exec(frontMatter(text))?.[1];
  if (!title) return undefined;
  return title.replace(/^(['"])(.*)\1$/, "$2").trim() || undefined;
}

const safeLoad = (text: string) => {
  try {
    return load(text);
  } catch {
    return undefined;
  }
};

/** fn over items, at most limit at a time: GitHub's raw files, not all 300 at once. */
async function mapLimited<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function fetchText(url: string, firstBytes?: number): Promise<string> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(10_000),
    headers: firstBytes ? { Range: `bytes=0-${firstBytes - 1}` } : undefined,
  });
  if (!response.ok) throw new Error(`${response.status} for ${new URL(url).pathname}`);
  return response.text();
}
