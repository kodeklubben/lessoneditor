import { headerSections } from "./markdown-it-plugins/markdown-it-header-sections";
import { insertImg } from "./markdown-it-plugins/markdown-it-insert-img";
import { generateChecklist } from "./markdown-it-plugins/markdown-it-checklist";
import { markdownItLineNumber } from "./markdown-it-plugins/markdown-it-line-number";
import { toggleHints } from "./markdown-it-plugins/markdown-it-toggle";

const hljs = require("highlight.js");
const { full: emoji } = require("markdown-it-emoji");
const markdownCustomContainer = require("markdown-it-container");

const md = require("markdown-it")({
  html: false,
  breaks: false,
  langPrefix: "",
  highlight: function (str: any, lang: any) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
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
  .use(require("markdown-it-attrs"), {
    // No style: {style="..."} let a lesson restyle or overlay the whole editor page.
    allowedAttributes: ["class", /^target.*$/, /^width.*$/, /^height.*$/],
  })
  .use(headerSections)
  .use(insertImg)
  .use(generateChecklist)
  .use(toggleHints)
  .use(emoji)
  .use(markdownCustomContainer, "video", {
    validate: function (params: string) {
      return params.trim().match(/^video\s*\[(.*)]$/);
    },
    // @ts-ignore
    render: function (
      tokens: {
        [x: string]: {
          info: any;
          type: string;
        };
      },
      idx: string | number,
    ) {
      if (tokens[idx].type === "container_video_open") {
        const matches = tokens[idx].info.trim().match(/^video\s*\[(.*)]$/);

        if (matches && matches[1]) {
          return '<div class="video-container">' + getVideoIframeMarkup({ url: matches[1].trim() });
        }
        return '<div class="video-container">';
      } else if (tokens[idx].type === "container_video_close") {
        return "</div>";
      }
    },
  })
  .use(markdownItLineNumber);

const escapeHtml: (value: string) => string = md.utils.escapeHtml;

export function getVideoIframeMarkup({ url }: { url: string }): string {
  const video = getVideoId(url);
  if (!video) {
    return "";
  }
  // The id is checked against a strict pattern and escaped, so it can never close the attribute.
  const id = escapeHtml(video.id);
  if (video.provider === "youtube") {
    return `<iframe src="https://www.youtube-nocookie.com/embed/${id}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  }
  return `<iframe src="https://player.vimeo.com/video/${id}" dnt="1" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID = /^[0-9]{1,12}$/;

export function getVideoId(url: string): { provider: "youtube" | "vimeo"; id: string } | undefined {
  let parsed: URL;
  try {
    parsed = new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`);
  } catch {
    return undefined;
  }
  const host = parsed.hostname.replace(/^(www\.|m\.)/, "");
  const segments = parsed.pathname.split("/").filter(Boolean);
  let id: string | null | undefined;
  if (host === "youtu.be") {
    id = segments[0];
  } else if (["youtube.com", "youtube-nocookie.com"].includes(host)) {
    id = ["embed", "v", "shorts", "live"].includes(segments[0])
      ? segments[1]
      : parsed.searchParams.get("v");
  } else if (["vimeo.com", "player.vimeo.com"].includes(host)) {
    const vimeoId = segments[segments.length - 1];
    return vimeoId && VIMEO_ID.test(vimeoId) ? { provider: "vimeo", id: vimeoId } : undefined;
  }
  return id && YOUTUBE_ID.test(id) ? { provider: "youtube", id } : undefined;
}

export const mdParser = (content: any) => {
  if (typeof content !== "string") {
    return " ";
  } else {
    return md.render(content);
  }
};
