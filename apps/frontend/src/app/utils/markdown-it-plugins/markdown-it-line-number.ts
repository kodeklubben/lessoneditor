import MarkdownIt from "markdown-it";

export function markdownItLineNumber(md: MarkdownIt): void {
  const defaultRender =
    md.renderer.rules.paragraph_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  // duplicate this for "heading_open", "list_item_open", etc as needed
  const types = ["paragraph_open", "heading_open", "list_item_open", "linebreak"];

  types.forEach((type) => {
    const defaultRenderer = md.renderer.rules[type] || defaultRender;

    md.renderer.rules[type] = function (tokens, idx, options, env, self) {
      // @ts-ignore
      tokens[idx].attrPush(["id", "line-" + (tokens[idx].map[0] + 1)]); // Adding +1 because line numbers usually start at 1, not 0 in a text editor.
      return defaultRenderer(tokens, idx, options, env, self);
    };
  });
}
