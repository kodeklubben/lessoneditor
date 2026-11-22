const mockParse = jest.fn((code: string, options: { inline: boolean }) => ({ code, options }));
jest.mock("scratchblocks/browser.js", () => ({
  default: {
    loadLanguages: jest.fn(),
    parse: mockParse,
    newView: (doc: { code: string; options: { inline: boolean } }) => ({
      render: () => {
        const svg = globalThis.document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("width", "10");
        svg.setAttribute("height", "5");
        svg.setAttribute("data-code", doc.code);
        svg.setAttribute("data-inline", String(doc.options.inline));
        return svg;
      },
    }),
  },
}));

import { renderScratchBlocks } from "./renderScratchblocks";

describe("Scratch blocks in the preview", () => {
  beforeEach(() => mockParse.mockClear());

  it("renders inline {.b} blocks inline and block scripts as blocks", () => {
    const html = renderScratchBlocks(
      '<p>Bruk <code class="b">si [Hei!]</code> her.</p>' +
        '<pre><code class="blocks">når grønt flagg klikkes\nflytt (10) steg\n</code></pre>',
    );
    expect(html).not.toContain('<code class="b">');
    expect(html).not.toContain('<code class="blocks">');
    expect(html).toContain('data-inline="true"');
    expect(html).toContain('data-inline="false"');
    expect(html).toContain('aria-label="si [Hei!]"');
  });

  it("gives scratchblocks the real characters, not HTML entities", () => {
    renderScratchBlocks('<code class="b">&lt;(x) = [5]&gt; &amp; mer</code>');
    expect(mockParse).toHaveBeenCalledWith(
      "<(x) = [5]> & mer",
      expect.objectContaining({ inline: true }),
    );
  });
});
