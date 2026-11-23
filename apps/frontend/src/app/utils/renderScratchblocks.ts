import md5 from "crypto-js/md5";

/**
 * Render scratchblocks
 * @param {string} content HTML with <pre><code class="blocks">...</code></pre> (block scripts)
 *   and <code class="b">...</code> (single blocks inside a sentence)
 * @returns {string} the same HTML with each of them replaced by an SVG
 */

// Ukrainian is "uk" here; the lesson repo names it "ua" (N10). Its 43 Scratch texts write their
// blocks in Ukrainian, which did not render.
const LANGUAGES = ["nb", "nn", "en", "is", "uk", "fr"];

const storeSVG: Record<string, string> = {};

/** markdown-it escapes the code; scratchblocks needs the characters (<, >, &) back. */
const unescapeHtml = (html: string) =>
  html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

const PATTERNS = [
  { inline: false, re: /<pre><code class="blocks">([\s\S]*?)<\/code><\/pre>/g },
  // Inline blocks: `si [Hei!]`{.b} renders as <code class="b">si [Hei!]</code>
  { inline: true, re: /<code class="b">([\s\S]*?)<\/code>/g },
];

let scratchblocksModule: any;

/** Loaded on first use; the languages are registered once, not on every render. */
const loadScratchblocks = () => {
  if (!scratchblocksModule) {
    scratchblocksModule = require("scratchblocks/browser.js");
    // NOTE: English (en) is included by default. All other languages
    //       that exist in getAvailableLanguages() should be loaded here,
    //       otherwise rendering will fail.
    scratchblocksModule.default.loadLanguages({
      nb: require("scratchblocks/locales/nb.json"),
      nn: require("scratchblocks/locales/nn.json"),
      is: require("scratchblocks/locales/is.json"),
      uk: require("scratchblocks/locales/uk.json"),
      fr: require("scratchblocks/locales/fr.json"),
    });
  }
  return scratchblocksModule;
};

export const renderScratchBlocks = (content: string) => {
  const scratchblocks = loadScratchblocks();

  let returnContent = content;
  for (const { inline, re } of PATTERNS) {
    returnContent = returnContent.replace(re, (block: string, escaped: string) => {
      const code = unescapeHtml(escaped);
      const checksum = `${inline ? "i" : "b"}:${md5(code).toString()}`;
      if (!(checksum in storeSVG)) {
        try {
          const doc = scratchblocks.default.parse(code, { inline, languages: LANGUAGES });
          const svg = scratchblocks.default.newView(doc, { style: "scratch3" }).render();
          svg.setAttribute(
            "viewBox",
            `0 0 ${svg.getAttribute("width")} ${svg.getAttribute("height")}`,
          );
          if (inline) {
            svg.style.display = "inline-block";
            svg.style.verticalAlign = "middle";
            svg.setAttribute("role", "img");
            svg.setAttribute("aria-label", code);
          } else {
            svg.style.maxWidth = "100%";
            svg.style.display = "block";
            svg.style.margin = "0 auto 15px";
          }
          storeSVG[checksum] = svg.outerHTML;
        } catch (error) {
          console.error(error);
          return block;
        }
      }
      return storeSVG[checksum];
    });
  }
  return returnContent;
};
