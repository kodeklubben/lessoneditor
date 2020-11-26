import yaml from "js-yaml";

/**
 *
 * @param {String} yamlHeader
 */
function yamlHeaderLoad(yamlHeader, language) {
  const { title, author, translator } = yaml.load(yamlHeader) || {};
  const authorList = author ? author.split(",") : [];
  const translatorList = translator ? translator.split(",") : [];
  return {
    title,
    authorList,
    translatorList,
    language,
  };
}

export default yamlHeaderLoad;
