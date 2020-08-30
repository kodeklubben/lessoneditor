import { headerSections } from "./markdown-it-plugins/markdown-it-header-sections";
import { insertImg } from "./markdown-it-plugins/markdown-it-insert-img";
import { generateChecklist } from "./markdown-it-plugins/markdown-it-checklist";

const hljs = require("highlight.js");

const md = require("markdown-it")({
  html: true,
  langPrefix: "",
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    if (!lang) {
      // autodetect language
      try {
        return hljs.highlightAuto(str).value;
      } catch (e) {}
    }
    return "";
  },
})
  .use(require("markdown-it-attrs"), { allowedAttributes: ["class"] })
  .use(headerSections)
  .use(insertImg)
  .use(generateChecklist);

export const mdParser = (content) => {
  if (typeof content !== "string") {
    return " ";
  } else {
    return md.render(content);
  }
};
