import { headerSections } from "./markdown-it-plugins/markdown-it-header-sections";
import { insertImg } from "./markdown-it-plugins/markdown-it-insert-img";
import { generateChecklist } from "./markdown-it-plugins/markdown-it-checklist";

const hljs = require("highlight.js");
var emoji = require("markdown-it-emoji");
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
  .use(markdownCustomContainer, "video", {
    validate: function (params) {
      return params.trim().match(/^video\s*\[(.*)]$/);
    },

    render: function (tokens, idx) {
      if (tokens[idx].type === "container_video_open") {
        const matches = tokens[idx].info.trim().match(/^video\s*\[(.*)]$/);

        if (matches && matches[1]) {
          return (
            '<div class="video-container">' +
            getVideoIframeMarkup({ url: matches[1].trim() })
          );
        }
      } else if (tokens[idx].type === "container_video_close") {
        return "</div>";
      }
    },
  });

function getVideoIframeMarkup(url) {
  const providerAndVideoID = getVideoId(url);

  const videoId = Object.values(providerAndVideoID)[0];
  const provider = Object.keys(providerAndVideoID)[0];

  if (!videoId) {
    return "";
  }
  if (provider === "youtube") {
    return `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else if (provider === "vimeo") {
    return `<iframe src="https://player.vimeo.com/video/${videoId}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  } else {
    console.error("markdown custom container error");
  }
}

function getVideoId(url) {
  const youtubeRegEx =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

  const vimeoRegEx = /^(http:\/\/|https:\/\/)?(www\.)?(vimeo\.com\/)([0-9]+)$/;

  const isYoutube = url.url.match(youtubeRegEx);
  const isVimeo = url.url.match(vimeoRegEx);

  const match = isYoutube || isVimeo;

  if (isYoutube) {
    return match && match[2].length === 11 ? { youtube: match[2] } : null;
  } else if (isVimeo) {
    return match ? { vimeo: match[match.length - 1] } : null;
  } else {
    console.error("RegEx validate error");
  }
}

export const mdParser = (content) => {
  if (typeof content !== "string") {
    return " ";
  } else {
    return md.render(content);
  }
};
