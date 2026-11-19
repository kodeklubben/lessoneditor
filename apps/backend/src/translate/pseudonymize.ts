/**
 * Before a lesson text leaves our servers for translation, everything that is not prose is
 * replaced by numbered placeholders (⟦0⟧, ⟦1⟧ …): code, Scratch/inline code, {.attributes},
 * link and image targets, URLs, HTML, containers, e-mail addresses, phone numbers and the names
 * of the people on the lesson. The provider only sees the words; restore() puts everything back.
 */

interface Slot {
  value: string;
  /** A ⟦n⟧ that was already in the source text; restored as is, never expanded. */
  literal?: boolean;
}

export interface ProtectedText {
  text: string;
  slots: Slot[];
}

const TOKEN = /⟦(\d+)⟧/g;
const token = (index: number) => `⟦${index}⟧`;
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function protect(markdown: string, names: string[] = []): ProtectedText {
  const slots: Slot[] = [];
  const keep = (value: string, literal = false) => {
    slots.push({ value, literal });
    return token(slots.length - 1);
  };
  let text = markdown.replace(/\r\n/g, "\n");

  text = text.replace(TOKEN, (match) => keep(match, true));
  // Fenced code blocks (``` and ~~~), fences included. Code and Scratch stay as written.
  text = text.replace(/^[ \t]*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^[ \t]*\1[ \t]*$/gm, (m) => keep(m));
  // Container lines such as :::video[...] and :::
  text = text.replace(/^[ \t]*:::.*$/gm, (m) => keep(m));
  // Reference-style link definitions: [x]: https://…
  text = text.replace(/^[ \t]*\[[^\]\n]+\]:[ \t]*\S.*$/gm, (m) => keep(m));
  // Inline code, also with attributes like `si hei`{.b}
  text = text.replace(/`[^`\n]+`(\{[^}\n]*\})?/g, (m) => keep(m));
  // Attribute blocks: {.activity}, {#id}, {target=_blank}
  text = text.replace(/\{[ \t]*(?:[.#]|[A-Za-z][\w-]*=)[^{}\n]*\}/g, (m) => keep(m));
  // Link and image targets; the visible text and alt text are translated.
  text = text.replace(/(!?\[[^\]\n]*\]\()([^)\n]*)(\))/g, (_, open, target, close) => {
    return open + keep(target) + close;
  });
  // Autolinks, HTML tags, bare URLs
  text = text.replace(/<[^>\n]+>/g, (m) => keep(m));
  text = text.replace(/\b(?:https?:\/\/|www\.)[^\s)⟦]+/gi, (m) => keep(m));
  // E-mail addresses and phone numbers (8 or more digits, optionally with +country code)
  text = text.replace(/[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.\p{L}{2,}/gu, (m) => keep(m));
  text = text.replace(/(?<![\p{L}\p{N}⟦])\+?\d(?:[ -]?\d){7,}(?![\p{L}\p{N}⟧])/gu, (m) => keep(m));
  // Names of the authors, translators and the person translating: full names, then parts.
  const parts = new Set<string>();
  for (const name of names) {
    const clean = (name ?? "").trim();
    if (clean.length >= 2) parts.add(clean);
    for (const part of clean.split(/\s+/)) if (part.length >= 3) parts.add(part);
  }
  for (const part of [...parts].sort((a, b) => b.length - a.length)) {
    const pattern = new RegExp(`(?<![\\p{L}\\p{N}])${escapeRegExp(part)}(?![\\p{L}\\p{N}])`, "giu");
    text = text.replace(pattern, (m) => keep(m));
  }
  return { text, slots };
}

export function restore(text: string, slots: Slot[]): string {
  const expand = (index: number, depth: number): string => {
    const slot = slots[index];
    if (!slot) return token(index);
    if (slot.literal || depth > 10) return slot.value;
    return slot.value.replace(TOKEN, (_, n) => expand(Number(n), depth + 1));
  };
  return text.replace(TOKEN, (_, n) => expand(Number(n), 0));
}

const headings = (text: string) =>
  (text.match(/^#{1,6}(?=\s)/gm) ?? []).map((marks) => marks.length).join(",");
const listItems = (text: string) => (text.match(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/gm) ?? []).length;

/**
 * Problems with a translated chunk; empty when every placeholder is there exactly once and the
 * headings and list items are unchanged. A failing chunk is never saved.
 */
export function checkTranslation(source: string, translated: string): string[] {
  const problems: string[] = [];
  const expected = (source.match(TOKEN) ?? []).sort();
  const actual = (translated.match(TOKEN) ?? []).sort();
  if (expected.join() !== actual.join()) problems.push("placeholders");
  if (headings(source) !== headings(translated)) problems.push("headings");
  if (listItems(source) !== listItems(translated)) problems.push("list items");
  if (translated.trim() === "" && source.trim() !== "") problems.push("empty");
  return problems;
}

/** Splits at headings so each request stays small; the pieces join back without loss. */
export function chunk(text: string, maxLength = 4000): string[] {
  const sections = text.split(/(?=^#{1,6}\s)/m);
  const chunks: string[] = [];
  let current = "";
  for (const section of sections) {
    if (current && current.length + section.length > maxLength) {
      chunks.push(current);
      current = "";
    }
    current += section;
  }
  if (current) chunks.push(current);
  return chunks;
}
