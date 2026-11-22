import { checkTranslation, chunk, protect, restore } from "./pseudonymize";

const lesson = `# Hei, verden {.intro}

Laget av Ada Lovelace. Spørsmål? Send en e-post til ada@example.no eller ring +47 912 34 567.

## Steg 1: Skriv kode {.activity}

- [ ] Skriv \`print("Hei Ada")\` i editoren
- [ ] Bruk blokken \`si [Hei!]\`{.b}

\`\`\`python
# Ada sin kommentar
print("Hei")
\`\`\`

Se [dokumentasjonen](https://docs.python.org/3/ "Python") og ![En katt](./katt.png).
Les mer på https://kidsakoder.no/oppgaver eller <https://scratch.mit.edu>.

:::video[https://youtu.be/dQw4w9WgXcQ]
:::

<span>html</span> Lovelace skrev dette.
`;

describe("pseudonymising a lesson before translation", () => {
  const names = ["Ada Lovelace"];
  const { text, slots } = protect(lesson, names);

  it("sends no names, e-mail addresses or phone numbers", () => {
    expect(text).not.toMatch(/Ada|Lovelace/);
    expect(text).not.toContain("ada@example.no");
    expect(text).not.toContain("912 34 567");
  });

  it("hides code, inline Scratch, attributes, link targets, URLs, HTML and containers", () => {
    for (const hidden of [
      'print("Hei")',
      "si [Hei!]",
      "{.b}",
      "{.activity}",
      "{.intro}",
      "https://docs.python.org",
      "./katt.png",
      "https://kidsakoder.no/oppgaver",
      "<https://scratch.mit.edu>",
      ":::video",
      "<span>",
    ]) {
      expect(text).not.toContain(hidden);
    }
  });

  it("keeps the prose, link text and alt text for translation", () => {
    expect(text).toContain("# Hei, verden");
    expect(text).toContain("## Steg 1: Skriv kode");
    expect(text).toContain("[dokumentasjonen](");
    expect(text).toContain("![En katt](");
  });

  it("restores the exact original", () => {
    expect(restore(text, slots)).toBe(lesson);
  });

  it("restores into a translated text", () => {
    const translated = text
      .replace("Hei, verden", "Hello, world")
      .replace("Skriv kode", "Write code");
    const back = restore(translated, slots);
    expect(back).toContain("# Hello, world {.intro}");
    expect(back).toContain("## Steg 1: Write code {.activity}");
    expect(back).toContain("ada@example.no");
    expect(back).toContain('```python\n# Ada sin kommentar\nprint("Hei")\n```');
  });

  it("leaves placeholder-like text in the source alone", () => {
    const source = "Bruk ⟦0⟧ som eksempel, og `kode`.";
    const result = protect(source);
    expect(restore(result.text, result.slots)).toBe(source);
  });
});

describe("checking the translation", () => {
  const { text } = protect(lesson, ["Ada Lovelace"]);

  it("accepts a translation that keeps every placeholder and the structure", () => {
    expect(checkTranslation(text, text.replace("Hei, verden", "Hello, world"))).toEqual([]);
  });

  it("rejects missing or duplicated placeholders", () => {
    expect(checkTranslation(text, text.replace("⟦1⟧", ""))).toContain("placeholders");
    expect(checkTranslation(text, `${text} ⟦1⟧`)).toContain("placeholders");
    expect(checkTranslation(text, `${text} ⟦999⟧`)).toContain("placeholders");
  });

  it("rejects changed headings or lists and empty answers", () => {
    expect(checkTranslation(text, text.replace("## Steg 1", "### Step 1"))).toContain("headings");
    expect(checkTranslation(text, text.replace("- [ ] Bruk", "Bruk"))).toContain("list items");
    expect(checkTranslation(text, " ")).toContain("empty");
  });
});

describe("chunking", () => {
  it("splits at headings and joins back unchanged", () => {
    const text = Array.from(
      { length: 30 },
      (_, i) => `## Steg ${i}\n\n${"tekst ".repeat(40)}\n`,
    ).join("\n");
    const chunks = chunk(text, 1000);
    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((part) => part.length <= 1300)).toBe(true);
    expect(chunks.join("")).toBe(text);
  });
});
