import {
  BadGatewayException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Request } from "express";
import {
  parseLessonMarkdown,
  stringifyLessonMarkdown,
} from "../../../../libs/contracts/src/lib/frontmatter";
import { isLanguageCode } from "../../../../libs/contracts/src/lib/validation";
import { LessonService } from "../lesson/lesson.service";
import { User } from "../user/user.entity";
import { checkTranslation, chunk, protect, restore } from "./pseudonymize";
import { providerFromEnv, TranslationProvider } from "./provider";
import { RateLimiter } from "./rate-limit";

interface StoredHeader {
  title?: string;
  authorList?: string[];
  translatorList?: string[];
  language?: string;
}

/** README / README_en are teacher guides; <slug> / <slug>_en are lesson texts. */
export function targetFilename(source: string, lessonSlug: string, language: string): string {
  const base = /^README(_[a-z]{2,3})?$/.test(source) ? "README" : lessonSlug;
  return language === "nb" ? base : `${base}_${language}`;
}

/** Keeps the whitespace around a chunk, which models tend to trim. */
function keepEdges(source: string, translated: string): string {
  const lead = source.match(/^\s*/)?.[0] ?? "";
  const trail = source.match(/\s*$/)?.[0] ?? "";
  return lead + translated.trim() + trail;
}

@Injectable()
export class TranslateService {
  provider: TranslationProvider | null = providerFromEnv();
  private readonly perUser = new RateLimiter(
    Number(process.env.TRANSLATION_LIMIT_PER_HOUR) || 10,
    3600000,
  );
  private readonly overall = new RateLimiter(
    Number(process.env.TRANSLATION_LIMIT_PER_DAY) || 200,
    86400000,
  );
  private readonly running = new Set<number>();

  constructor(private readonly lessonService: LessonService) {}

  get enabled(): boolean {
    return this.provider !== null;
  }

  /**
   * Translates one text of a lesson into a new file. Only pseudonymised prose leaves the server:
   * never the front matter, names, contact details, code or links. Nothing is saved unless every
   * chunk passed the structure check. The user becomes the translator, the authors stay.
   */
  async translateFile(
    lessonId: number,
    sourceFilename: string,
    targetLanguage: string,
    request: Request,
  ): Promise<{ filename: string; language: string }> {
    const user = request.user as User;
    if (!this.provider) throw new ServiceUnavailableException("Oversettelse er ikke slått på");
    if (!isLanguageCode(targetLanguage)) throw new HttpException("Ugyldig språk", 400);
    if (this.running.has(user.userId))
      throw new HttpException("En oversettelse pågår allerede", HttpStatus.TOO_MANY_REQUESTS);

    const lesson = await this.lessonService.getLesson(lessonId);
    const source = lesson.files.find(
      (file) => file.filename === sourceFilename && file.ext === ".md",
    );
    if (!source) throw new NotFoundException("Fant ikke teksten som skal oversettes");
    const filename = targetFilename(sourceFilename, lesson.lessonSlug, targetLanguage);
    if (lesson.files.some((file) => file.filename === filename))
      throw new ConflictException("Teksten finnes allerede på dette språket");

    if (!this.perUser.take(String(user.userId)) || !this.overall.take("all"))
      throw new HttpException(
        "Grensen for oversettelser er nådd. Prøv igjen senere.",
        HttpStatus.TOO_MANY_REQUESTS,
      );

    const { data, body } = parseLessonMarkdown<StoredHeader>(source.content.toString("utf-8"));
    const from = data.language || "nb";
    const names = [
      ...(data.authorList ?? []),
      ...(data.translatorList ?? []),
      user.name,
      user.username,
    ].filter((name): name is string => typeof name === "string");
    const { text, slots } = protect(body, names);

    this.running.add(user.userId);
    let translated: string;
    try {
      const parts: string[] = [];
      for (const part of chunk(text)) {
        if (!part.trim()) {
          parts.push(part);
          continue;
        }
        const result = keepEdges(part, await this.provider.translate(part, from, targetLanguage));
        const problems = checkTranslation(part, result);
        if (problems.length > 0) {
          console.error("Translation rejected:", problems.join(", "));
          throw new BadGatewayException(
            "Oversettelsen endret oppbygningen av teksten og ble ikke lagret. Prøv igjen.",
          );
        }
        parts.push(result);
      }
      translated = restore(parts.join(""), slots);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error("Translation failed:", error instanceof Error ? error.message : "error");
      throw new BadGatewayException("Oversettelsestjenesten svarte ikke. Prøv igjen senere.");
    } finally {
      this.running.delete(user.userId);
    }

    const header = {
      title: data.title ?? lesson.lessonTitle,
      author: "",
      authorList: data.authorList ?? [],
      language: targetLanguage,
      translator: "",
      translatorList: [user.name || user.username].filter(Boolean),
      machineTranslated: true,
      translatedFrom: from,
    };
    await this.lessonService.addLessonFile(
      lessonId,
      { filename, ext: ".md", content: stringifyLessonMarkdown(header, translated) },
      request,
    );
    return { filename, language: targetLanguage };
  }
}
