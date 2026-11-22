import DOMPurify from "dompurify";

/** The only places an embedded frame may point to: the video players and MakeCode. */
const FRAME_ORIGINS = [
  "https://www.youtube-nocookie.com/embed/",
  "https://player.vimeo.com/video/",
  "https://makecode.microbit.org/",
];

let hooked = false;

function install() {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook("uponSanitizeElement", (node, data) => {
    if (data.tagName === "use") {
      // Scratch blocks draw their icons (green flag, turn arrows) with <use href="#sb3-…">. Only a
      // reference to the same document is kept: an external one could load another SVG.
      const element = node as Element;
      const href = element.getAttribute("href") ?? element.getAttribute("xlink:href") ?? "";
      if (!href.startsWith("#")) node.parentNode?.removeChild(node);
      return;
    }
    if (data.tagName !== "iframe") return;
    const src = (node as Element).getAttribute("src") || "";
    if (!FRAME_ORIGINS.some((origin) => src.startsWith(origin))) node.parentNode?.removeChild(node);
  });
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    // Links that open a new tab must not get a handle on the editor window.
    if (node.tagName === "A" && node.getAttribute("target")) {
      node.setAttribute("rel", "noopener noreferrer");
    }
  });
}

/**
 * Cleans the rendered lesson before it goes into dangerouslySetInnerHTML. markdown-it already
 * escapes raw HTML; this is the second wall for plugins, attributes and the Scratch SVG.
 */
export function sanitizeLessonHtml(html: string): string {
  install();
  return DOMPurify.sanitize(html, {
    ADD_TAGS: ["iframe", "use"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "dnt", "target"],
    FORBID_TAGS: ["style", "form", "button", "textarea", "select"],
    // DOMPurify's default list, plus blob: for the lesson's own images loaded in the editor.
    ALLOWED_URI_REGEXP:
      /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix|blob):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}
