// import { getAvailableLanguages } from "./filterUtils";

/**
 * Render scratchblocks
 * @param {string} content HTML with <pre class="blocks">...</pre> and <code class="b">...</code>
 * @param {object} styles css-modules object
 * @returns {string} <pre class="blocks">...</pre> and <code class="b">...</code> replaced with SVG
 */
export const renderScratchBlocks = (content) => {
  const scratchblocks = require("scratchblocks/browser.js");

  // NOTE: English (en) is included by default. All other languages
  //       that exist in getAvailableLanguages() should be loaded here,
  //       otherwise rendering will fail.
  //       It is also possible to just do a
  //           require('scratchblocks/locales-src/translations-all.js')
  //       but that includes many unnecessary files.
  scratchblocks.loadLanguages({
    nb: require("scratchblocks/locales/nb.json"),
    nn: require("scratchblocks/locales/nn.json"),
    is: require("scratchblocks/locales/is.json"),
  });

  let replace = [];

  replace.push({
    start: '<pre><code class="blocks">',
    end: "</code></pre>",
    options: { inline: true, languages: ["nb, nn, en"] },
  });

  let returnContent = content;
  replace.forEach((r) => {
    const re = new RegExp(r.start + "[\\s\\S]*?" + r.end, "g");

    let blocks = content.match(re);
    if (blocks) {
      blocks.forEach((block) => {
        let code = block.substring(r.start.length, block.length - r.end.length);
        console.log("code : " + code);
        let doc = scratchblocks.parse(code, {
          inline: false,
          languages: ["nb", "nn", "en", "is"],
        });
        let docView = scratchblocks.newView(doc, { style: "scratch3" });
        let svg = docView.render();
        svg.setAttribute(
          "viewBox",
          `0 0 ${svg.getAttribute("width")} ${svg.getAttribute("height")}`
        );
        svg.style.maxWidth = "100%";

        svg.style.display = "block";
        svg.style.margin = "0 auto 15px";
        returnContent = returnContent.replace(block, svg.outerHTML);
      });
    }
  });
  return returnContent;
};
