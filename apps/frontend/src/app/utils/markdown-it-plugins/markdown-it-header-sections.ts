// Based on markdown-down-it-header-sections by arve0: https://github.com/arve0/markdown-it-header-sections

export function headerSections(md: { core: { ruler: string[]; }; }) {
  function addSections(state: { Token: any; tokens: string | any[]; }) {
    let tokens = []; // output
    let Token = state.Token;
    let sections: { header: number; nesting: number; }[] = [];
    let nestedLevel = 0;

    function openSection(attrs: any[]) {
      let t = new Token("section_open", "section", 1);
      t.block = true;
      t.attrs =
        attrs &&
        attrs.map(function (attr) {
          return [attr[0], "section_" + attr[1]];
        });
      return t;
    }

    function closeSection() {
      let t = new Token("section_close", "section", -1);
      t.block = true;
      return t;
    }

    function closeSections(section: { header: any; nesting?: number; }) {
      while (last(sections) && section.header <= last(sections).header) {
        sections.pop();
        tokens.push(closeSection());
      }
    }

    function closeSectionsToCurrentNesting(nesting: number) {
      while (last(sections) && nesting <= last(sections).nesting) {
        sections.pop();
        tokens.push(closeSection());
      }
    }

    function closeAllSections() {
      while (sections.pop()) {
        tokens.push(closeSection());
      }
    }

    for (let i = 0, l = state.tokens.length; i < l; i++) {
      let token = state.tokens[i];

      // record level of nesting
      if (token.type.search("heading") !== 0) {
        nestedLevel += token.nesting;
      }
      if (last(sections) && nestedLevel < last(sections).nesting) {
        closeSectionsToCurrentNesting(nestedLevel);
      }
      // add sections before headers
      if (token.type === "heading_open") {
        let section = {
          header: headingLevel(token.tag),
          nesting: nestedLevel,
        };
        if (last(sections) && section.header <= last(sections).header) {
          closeSections(section);
        }
        tokens.push(openSection(token.attrs));
        if (token.attrIndex("id") !== -1) {
          // Remove ID from token
          token.attrs.splice(token.attrIndex("id"), 1);
        }
        sections.push(section);
      }
      tokens.push(token);
    }
    //end for every token
    closeAllSections();
    state.tokens = tokens;
  }
  // @ts-ignore
  md.core.ruler.push("header_sections", addSections);
}

function headingLevel(header: string) {
  return parseInt(header.charAt(1));
}

function last(arr: any[]) {
  return arr.slice(-1)[0];
}
