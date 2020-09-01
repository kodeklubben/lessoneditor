import yaml from "js-yaml";

const parseMdHeader = (mdText) => {
  try {
    return yaml.safeLoad(mdText);
  } catch (e) {
    console.log(e);
  }
};

export default parseMdHeader;
