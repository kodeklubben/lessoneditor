import { MarkdownIt } from "markdown-it";

/**
 * The hints in kodeklubben's lessons, written in HTML on lines of their own:
 *
 *   <toggle>
 *     <strong>Hint</strong>
 *     <hide>
 *
 *     Markdown that stays hidden until the hint is opened.
 *
 *     </hide>
 *   </toggle>
 *
 * The editor parses Markdown without HTML, so these lines used to show as text. This rule reads
 * only these tags, each on a line of its own, and turns them into <details>: the hint opens and
 * closes in the preview as on kodeklubben.no. Any other HTML still shows as text.
 */
const TAG = /^\s*(<\/?toggle>|<\/?hide>|<strong>[^<]*<\/strong>)/;

export function toggleHints(md: MarkdownIt): void {
  const escape = md.utils.escapeHtml;

  md.block.ruler.before(
    "paragraph",
    "lesson_toggle",
    (state, startLine, _endLine, silent) => {
      if (state.sCount[startLine] - state.blkIndent >= 4) return false; // indented code
      const start = state.bMarks[startLine] + state.tShift[startLine];
      const line = state.src.slice(start, state.eMarks[startLine]);
      if (!line.startsWith("<")) return false;

      // Read on copies: a silent call (does this line end the paragraph above?) changes nothing.
      const env = state.env as { toggleOpen?: number; toggleSummary?: boolean };
      let open = env.toggleOpen ?? 0;
      let summary = env.toggleSummary ?? false;
      let rest = line;
      let html = "";
      while (rest.trim()) {
        const match = TAG.exec(rest);
        if (!match) return false;
        const tag = match[1];
        if (tag === "<toggle>") {
          html += '<details class="toggle">';
          open += 1;
          summary = true;
        } else if (tag === "</toggle>") {
          if (!open) return false;
          html += "</details>";
          open -= 1;
        } else if (tag === "<hide>") {
          if (!open) return false;
          html += '<div class="toggle__content">';
          summary = false;
        } else if (tag === "</hide>") {
          if (!open) return false;
          html += "</div>";
        } else {
          // <strong>…</strong> names the hint only right after <toggle>.
          if (!open || !summary) return false;
          html += `<summary>${escape(tag.slice(8, -9).trim())}</summary>`;
          summary = false;
        }
        rest = rest.slice(match[0].length);
      }
      if (silent) return true;
      env.toggleOpen = open;
      env.toggleSummary = summary;

      const token = state.push("html_block", "", 0);
      token.content = html;
      token.map = [startLine, startLine + 1];
      state.line = startLine + 1;
      return true;
    },
    // The closing tags may follow a paragraph or a list item without a blank line between.
    { alt: ["paragraph", "reference", "blockquote", "list"] },
  );
}
