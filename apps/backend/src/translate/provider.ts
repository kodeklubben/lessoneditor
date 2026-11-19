/** A translation backend in the EU. Only prose with placeholders is ever sent to it. */
export interface TranslationProvider {
  readonly name: string;
  translate(text: string, from: string, to: string): Promise<string>;
}

export const LANGUAGE_NAMES: Record<string, string> = {
  nb: "Norwegian Bokmål",
  nn: "Norwegian Nynorsk",
  se: "Northern Sami",
  en: "English",
  is: "Icelandic",
  fr: "French",
  sv: "Swedish",
  da: "Danish",
  de: "German",
};

export function systemPrompt(from: string, to: string): string {
  return [
    `Translate a programming lesson for children from ${LANGUAGE_NAMES[from] ?? from} to ${LANGUAGE_NAMES[to] ?? to}.`,
    "The text is Markdown. Keep every Markdown mark, line break, heading level, list item and blank line exactly where it is.",
    "Tokens like ⟦3⟧ are placeholders for code, links and names: copy each one unchanged, exactly once, in the matching place.",
    "Translate only the words. Answer with the translated text only, no comments.",
  ].join("\n");
}

/** Mistral's chat API on its EU endpoint (data processed in the EU). */
export class MistralProvider implements TranslationProvider {
  readonly name = "mistral";

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl = "https://api.eu.mistral.ai",
    private readonly model = "mistral-large-latest",
    private readonly fetchImpl: typeof fetch = fetch,
  ) {}

  async translate(text: string, from: string, to: string): Promise<string> {
    const response = await this.fetchImpl(
      `${this.baseUrl.replace(/\/$/, "")}/v1/chat/completions`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.model,
          temperature: 0.1,
          messages: [
            { role: "system", content: systemPrompt(from, to) },
            { role: "user", content: text },
          ],
        }),
        signal: AbortSignal.timeout(90000),
      },
    );
    if (!response.ok) throw new Error(`Translation provider answered ${response.status}`);
    const data = (await response.json()) as { choices?: { message?: { content?: unknown } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("Translation provider gave no text");
    return content;
  }
}

/**
 * Off unless configured: TRANSLATION_PROVIDER=mistral and MISTRAL_API_KEY. MISTRAL_BASE_URL
 * (default the EU endpoint) must be https; TRANSLATION_MODEL picks the model.
 */
export function providerFromEnv(
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): TranslationProvider | null {
  if (env.TRANSLATION_PROVIDER !== "mistral" || !env.MISTRAL_API_KEY) return null;
  const baseUrl = env.MISTRAL_BASE_URL || "https://api.eu.mistral.ai";
  if (new URL(baseUrl).protocol !== "https:") throw new Error("MISTRAL_BASE_URL must use https");
  return new MistralProvider(
    env.MISTRAL_API_KEY,
    baseUrl,
    env.TRANSLATION_MODEL || "mistral-large-latest",
    fetchImpl,
  );
}
