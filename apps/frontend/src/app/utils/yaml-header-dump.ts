import yaml from "js-yaml";

const yamlHeaderDump = (headerData: any, language?: string) => {
  const { title } = headerData || {};
  const author = headerData.authorList.join(", ");
  const translator = headerData.translatorList.join(", ");
  return yaml.dump({
    title,
    author,
    translator,
    language,
  });
};

export default yamlHeaderDump;
