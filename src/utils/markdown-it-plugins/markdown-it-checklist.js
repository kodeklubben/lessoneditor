// Based on markdown-it-task-list by revin: https://github.com/revin/markdown-it-task-lists

export function generateChecklist(md) {
  function addChecklist(state) {
    let tokens = state.tokens;
    for (let i = 2; i < tokens.length; i++) {
      if (isChecklistItem(tokens, i)) {
        let inputId = makeId();
        let checkbox = makeCheckbox(tokens[i], inputId, state.Token);
        let label = makeLabel(tokens[i].children, inputId, state.Token);
        tokens.splice(i, 0, checkbox, label);
        attrSet(tokens[i - 2], "class", "checklist-item");
        attrSet(
          tokens[parentToken(tokens, i - 2)],
          "class",
          "contains-checklist"
        );
      }
    }
  }

  md.core.ruler.push("checklist", addChecklist);
}

function attrSet(token, name, value) {
  if (token.tag !== "label") {
    let index = token.attrIndex(name);
    let attr = [name, value];

    if (index < 0) {
      token.attrPush(attr);
    } else {
      token.attrs[index] = attr;
    }
  }
}

function parentToken(tokens, index) {
  let targetLevel = tokens[index].level - 1;
  for (let i = index - 1; i >= 0; i--) {
    if (tokens[i].level === targetLevel) {
      return i;
    }
  }
  return -1;
}

function makeCheckbox(token, id, TokenConstructor) {
  let checkbox = new TokenConstructor("input_open", "input", 0);
  checkbox.attrSet("class", "checklist-item-checkbox");
  checkbox.attrSet("type", "checkbox");
  checkbox.attrSet("id", id);
  if (
    token.content.indexOf("[x] ") === 0 ||
    token.content.indexOf("[X] ") === 0
  ) {
    checkbox.attrSet("checked", "");
  }
  return checkbox;
}

function makeLabel(contentChildren, id, TokenConstructor) {
  let label = new TokenConstructor("label_open", "label", 0);
  label.attrSet("for", id);
  removeMarkdown(contentChildren[0]);
  label.children = contentChildren;
  return label;
}

function makeId() {
  return "task-item" + Math.ceil(Math.random() * (1000 * 1000) - 1000);
}

function removeMarkdown(token) {
  if (
    token.content.includes("[ ] ") ||
    token.content.includes("[x] ") ||
    token.content.includes("[X] ") ||
    token.content.indexOf("[&nbsp;] ")
  ) {
    token.content = token.content.substring(4, token.content.length);
  }
}

function isChecklistItem(tokens, index) {
  return (
    isInline(tokens[index]) &&
    isParagraph(tokens[index - 1]) &&
    isListItem(tokens[index - 2]) &&
    startsWithTodoMarkdown(tokens[index])
  );
}

function isInline(token) {
  return token.type === "inline";
}
function isParagraph(token) {
  return token.type === "paragraph_open";
}
function isListItem(token) {
  return token.type === "list_item_open";
}
function startsWithTodoMarkdown(token) {
  return (
    token.content.indexOf("[ ] ") === 0 ||
    token.content.indexOf("[x] ") === 0 ||
    token.content.indexOf("[X] ") === 0 ||
    token.content.indexOf("[&nbsp;] ")
  );
}
