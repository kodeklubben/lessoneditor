import { headerSections } from "./markdown-it-plugins/markdown-it-header-sections";
import { insertImg } from "./markdown-it-plugins/markdown-it-insert-img";
import { generateChecklist } from "./markdown-it-plugins/markdown-it-checklist";

const hljs = require("highlight.js");
var emoji = require("markdown-it-emoji");
const { html5Media, guessMediaType } = require("markdown-it-html5-media");
const markdownCustomContainer = require("markdown-it-container");

const md = require("markdown-it")({
  html: false,
  breaks: true,
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
  .use(generateChecklist)
  .use(emoji)
  .use(html5Media)
  .use(markdownCustomContainer, "youtube", {
    validate: function (params) {
      return params.trim().match(/^youtube\s*\[(.*)]$/);
    },

    render: function (tokens, idx) {
      if (tokens[idx].type === "container_youtube_open") {
        const matches = tokens[idx].info.trim().match(/^youtube\s*\[(.*)]$/);
        if (matches && matches[1]) {
          return (
            '<div class="video-container">' +
            getYoutubeIframeMarkup({ url: matches[1].trim() })
          );
        }
      } else if (tokens[idx].type === "container_youtube_close") {
        return "</div>";
      }
    },
  });

/*
  youtube-embedding beskrevet her
  https://blog.bhanuteja.dev/embed-you-tube-videos-into-your-markdown-editor
  */
function getYoutubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getYoutubeIframeMarkup(url) {
  const videoId = getYoutubeVideoId(url);
  if (!videoId) {
    return "";
  }
  return `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

export const mdParser = (content) => {
  if (typeof content !== "string") {
    return " ";
  } else {
    return md.render(content);
  }
};
