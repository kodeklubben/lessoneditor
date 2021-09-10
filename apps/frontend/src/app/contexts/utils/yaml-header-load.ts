import yaml from "js-yaml";
import { HeaderData } from "../FileContext";

/**
 *
 * @param {String} yamlHeader
 */
function yamlHeaderLoad(yamlHeader: string, language: string): HeaderData {
  // @ts-ignore
  const { title, author, translator } = yaml.load(yamlHeader) || {};
  const authorList = author ? author.split(",") : [];
  const translatorList = translator ? translator.split(",") : [];
  return {
    title,
    authorList,
    translatorList,
    language,
    author,
    translator,
  };
}

export default yamlHeaderLoad;
