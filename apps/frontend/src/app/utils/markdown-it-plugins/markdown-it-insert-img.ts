export function insertImg(md: { core: { ruler: string[] } }) {
  function addImgs(state: { Token: any; tokens: string | any[] }) {
    const tokens = []; //output
    const Token = state.Token;

    // Opens a new img element with src and alt.
    function openImg(src: string, alt: string) {
      const t = new Token("img_open", "img", 1);
      t.block = true;
      t.attrSet("src", src);
      t.attrSet("alt", alt);
      t.attrSet("loading", "lazy");
      return t;
    }

    /* Iterate through all tokens, if token contains "check" or
    "flag" as class name, insert corresponding img.*/
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (token.tag !== "section" && token.attrs !== null && token.attrs[0].includes("check")) {
        tokens.push(token);
        tokens.push(openImg("assets/public/sectionSVG/check.svg", "check"));
      } else if (
        token.tag !== "section" &&
        token.attrs !== null &&
        token.attrs[0].includes("flag")
      ) {
        tokens.push(token);
        tokens.push(openImg("assets/public/sectionSVG/flag.svg", "flag"));
      } else if (
        token.tag !== "section" &&
        token.attrs !== null &&
        token.attrs[0].includes("save")
      ) {
        tokens.push(token);
        tokens.push(openImg("assets/public/sectionSVG/save.svg", "save"));
      } else {
        tokens.push(token);
      }
    }
    state.tokens = tokens;
  }

  // @ts-ignore
  md.core.ruler.push("insert_img", addImgs);
}
