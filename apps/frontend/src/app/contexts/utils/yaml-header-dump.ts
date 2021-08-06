import yaml from "js-yaml";
import { HeaderData } from "../FileContext";

const yamlHeaderDump = (headerData: HeaderData, language?: string) => {
  const { title } = headerData || {};
  const author = headerData.authorList.join(", ");
  const translator = headerData.translatorList.join(", ");
  return yaml.dump({
    title,
    author,
    translator,
    language
  });
};

export default yamlHeaderDump;
