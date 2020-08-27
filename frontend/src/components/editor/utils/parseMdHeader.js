import yaml from "js-yaml";

const parseMdHeader = (mdText) => {
  try {
    const parts = mdText.split("---\n");
    const header = yaml.safeLoad(parts[1]);
    return {
      header: header,
      body: parts[2].trim(),
    };
  } catch (e) {
    console.log(e);
  }
};

export default parseMdHeader;
