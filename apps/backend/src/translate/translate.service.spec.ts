import { parseLessonMarkdown } from "../../../../libs/contracts/src/lib/frontmatter";
import { MistralProvider, providerFromEnv } from "./provider";
import { RateLimiter } from "./rate-limit";
import { targetFilename, TranslateService } from "./translate.service";

const source = `---
title: Hei verden
authorList:
  - Ada Lovelace
translatorList: []
language: nb
---
# Hei verden

Ada Lovelace laget dette. Kontakt: ada@example.no

\`\`\`python
print("Hei")
\`\`\`
`;

function setup(translate: (text: string) => Promise<string>) {
  const sent: string[] = [];
  const added: { filename: string; content: string }[] = [];
  const lessonService = {
    getLesson: jest.fn(async () => ({
      lessonId: 3,
      lessonSlug: "hei",
      lessonTitle: "Hei verden",
      files: [{ filename: "hei", ext: ".md", content: Buffer.from(source) }],
    })),
    addLessonFile: jest.fn(async (_id: number, file: { filename: string; content: string }) => {
      added.push(file);
      return { fileId: 1, filename: file.filename, ext: ".md" };
    }),
  };
  const service = new TranslateService(lessonService as never);
  service.provider = {
    name: "fake",
    translate: async (text: string) => {
      sent.push(text);
      return translate(text);
    },
  };
  const request = { user: { userId: 9, username: "bo-gh", name: "Bo Oversetter" } } as never;
  return { service, sent, added, request, lessonService };
}

describe("translating a lesson text", () => {
  const englishish = async (text: string) =>
    text.replace("Hei verden", "Hello world").replace("laget dette", "made this");

  it("sends only pseudonymised prose, never front matter, names, e-mail or code", async () => {
    const { service, sent, request } = setup(englishish);
    await service.translateFile(3, "hei", "en", request);
    const all = sent.join("\n");
    expect(all).not.toMatch(
      /Ada|Lovelace|ada@example\.no|authorList|title:|print\(|Bo Oversetter|bo-gh/,
    );
    expect(all).toContain("Hei verden");
  });

  it("saves a new file with the authors kept, the user as translator and the machine mark", async () => {
    const { service, added, request } = setup(englishish);
    await expect(service.translateFile(3, "hei", "en", request)).resolves.toEqual({
      filename: "hei_en",
      language: "en",
    });
    const { data, body } = parseLessonMarkdown<Record<string, unknown>>(added[0].content);
    expect(data).toMatchObject({
      authorList: ["Ada Lovelace"],
      translatorList: ["Bo Oversetter"],
      language: "en",
      machineTranslated: true,
      translatedFrom: "nb",
    });
    expect(body).toContain("# Hello world");
    expect(body).toContain("Ada Lovelace made this. Kontakt: ada@example.no");
    expect(body).toContain('print("Hei")');
  });

  it("saves nothing when the answer breaks placeholders or structure", async () => {
    const { service, added, request } = setup(async (text) => text.replace(/⟦\d+⟧/, ""));
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(service.translateFile(3, "hei", "en", request)).rejects.toMatchObject({
      status: 502,
    });
    error.mockRestore();
    expect(added).toEqual([]);
  });

  it("saves nothing when the provider fails, and says so", async () => {
    const { service, added, request } = setup(async () => Promise.reject(new Error("timeout")));
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(service.translateFile(3, "hei", "en", request)).rejects.toMatchObject({
      status: 502,
    });
    error.mockRestore();
    expect(added).toEqual([]);
  });

  it("is off without configuration", async () => {
    const { service, request } = setup(englishish);
    service.provider = null;
    expect(service.enabled).toBe(false);
    await expect(service.translateFile(3, "hei", "en", request)).rejects.toMatchObject({
      status: 503,
    });
  });

  it("refuses a language that already has a text, and bad language codes", async () => {
    const { service, request } = setup(englishish);
    await expect(service.translateFile(3, "hei", "nb", request)).rejects.toMatchObject({
      status: 409,
    });
    await expect(service.translateFile(3, "hei", "../x", request)).rejects.toMatchObject({
      status: 400,
    });
  });

  it("names teacher guides README_<lang> and lesson texts <slug>_<lang>", () => {
    expect(targetFilename("README", "hei", "nn")).toBe("README_nn");
    expect(targetFilename("README_en", "hei", "nb")).toBe("README");
    expect(targetFilename("hei_en", "hei", "is")).toBe("hei_is");
  });
});

describe("translation configuration", () => {
  it("is off unless a provider and key are set", () => {
    expect(providerFromEnv({})).toBeNull();
    expect(providerFromEnv({ TRANSLATION_PROVIDER: "mistral" })).toBeNull();
    expect(providerFromEnv({ TRANSLATION_PROVIDER: "openai", MISTRAL_API_KEY: "k" })).toBeNull();
    expect(providerFromEnv({ TRANSLATION_PROVIDER: "mistral", MISTRAL_API_KEY: "k" })?.name).toBe(
      "mistral",
    );
    expect(() =>
      providerFromEnv({
        TRANSLATION_PROVIDER: "mistral",
        MISTRAL_API_KEY: "k",
        MISTRAL_BASE_URL: "http://api.eu.mistral.ai",
      }),
    ).toThrow();
  });

  it("calls Mistral's EU endpoint with the key and the protected text only", async () => {
    const fetchImpl = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ choices: [{ message: { content: "Hello ⟦0⟧" } }] }),
    });
    const provider = new MistralProvider("key", undefined, undefined, fetchImpl);
    await expect(provider.translate("Hei ⟦0⟧", "nb", "en")).resolves.toBe("Hello ⟦0⟧");
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://api.eu.mistral.ai/v1/chat/completions");
    expect(init.headers.Authorization).toBe("Bearer key");
    expect(JSON.parse(init.body).messages[1]).toEqual({ role: "user", content: "Hei ⟦0⟧" });
  });
});

describe("rate limit", () => {
  it("allows a number of hits per window and key", () => {
    let now = 0;
    const limiter = new RateLimiter(2, 1000, () => now);
    expect([limiter.take("a"), limiter.take("a"), limiter.take("a"), limiter.take("b")]).toEqual([
      true,
      true,
      false,
      true,
    ]);
    now = 1001;
    expect(limiter.take("a")).toBe(true);
  });
});
