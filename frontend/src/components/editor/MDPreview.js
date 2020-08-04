import "./mdpreview.scss";
import React, { useEffect } from "react";
import { renderMicrobit } from "utils/renderMicrobit";
import { mdParser } from "../../utils/mdParser";
import md5 from "crypto-js/md5";

const LANGUAGES = ["nb", "nn", "en", "is"];

let storeSVG = {};

const renderScratchBlocks = (content) => {
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
  });

  let returnContent = content;
  replace.forEach((r) => {
    const re = new RegExp(r.start + "[\\s\\S]*?" + r.end, "g");

    let blocks = content.match(re);
    if (blocks) {
      blocks.forEach((block) => {
        let code = block.substring(r.start.length, block.length - r.end.length);
        const checksum = md5(code).toString();
        if (checksum in storeSVG) {
          returnContent = returnContent.replace(block, storeSVG[checksum]);
        } else {
          let doc = scratchblocks.parse(code, {
            inline: false,
            languages: LANGUAGES,
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
          storeSVG[checksum] = svg.outerHTML;
        }
      });
    }
  });
  return returnContent;
};

const MDPreview = ({ mdText, course, counter }) => {
  const parseMD = mdParser(mdText);
  useEffect(() => {
    if (course === "microbit" && counter > 1) {
      //TODO: Get lesson language
      renderMicrobit("nb");
    }
  }, [course, parseMD, counter]);

  if (course === "scratch" && counter > 1) {
    let lessonContent = renderScratchBlocks(parseMD);
    return (
      <div
        className="PreviewArea"
        dangerouslySetInnerHTML={{ __html: lessonContent }}
      />
    );
  } else {
    return (
      <div
        className="PreviewArea"
        dangerouslySetInnerHTML={{ __html: parseMD }}
      />
    );
  }
};

export default MDPreview;
