const createNewHeader = (state, language) => {
  if (Object.keys(state).length === 0) {
    return;
  }
  const newHeader = `---
title: ${state.title ? `"${state.title}"` : ""}
author: ${
    state.authorList.length > 0 ? `"${state.authorList.join(", ")}"` : ""
  } ${
    state.translatorList && state.translatorList.length > 0
      ? `
translator: "${state.translatorList.join(", ")}"`
      : ""
  }
language: ${language ? `"${language}"` : ""}
---`;
  return newHeader;
};

export default createNewHeader;
