import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import saveMdText from "../api/save-md-text";
import fetchMdText from "../api/fetch-md-text";
import yamlHeaderDump from "./utils/yaml-header-dump";
import yamlHeaderLoad from "./utils/yaml-header-load";
import insertMetaDataInTeacherGuide from "../components/editor/utils/insertMetaDataInTeacherGuide";
import oppgaveMal from "../components/editor/settingsFiles/oppgaveMal";
import { useLessonContext } from "./LessonContext";
import { filenameParser } from "../utils/filename-parser";

interface ContextProps {
  headerData: HeaderData;
  savedFileBody: string;
  saveFileBody: (
    lessonId: string,
    filename: string,
    headerData: string,
    regenThumb: boolean
  ) => Promise<void>;
  saveFileHeader: (lessonId: string, filename: string, headerData: HeaderData) => Promise<void>;
  rawMdFileContent: String;
  fetchMdText: (lessonId: string, filename: string) => {};
  setHeaderData: Dispatch<SetStateAction<HeaderData>>;
}

export interface HeaderData {
  title: string;
  authorList: string[];
  translatorList: string[];
  translator: boolean;
  language: string;
  author: boolean;
}

const FileContext = React.createContext<Partial<ContextProps>>({});

function createDefaultFileBody(file: string, ymlData: any) {
  const { isReadme } = filenameParser(file);
  return isReadme ? insertMetaDataInTeacherGuide(ymlData) : oppgaveMal;
}

const FileContextProvider = (props: any) => {
  const { lessonId, file } = useParams<any>();
  const { getYmlData } = useLessonContext();
  const [rawMdFileContent, setRawMdFileContent] = useState<string>("");
  const { language } = filenameParser(file);
  const [headerData, setHeaderData] = useState<HeaderData>({
    title: "",
    authorList: [],
    translatorList: [],
    language,
    author: false,
    translator: false,
  });
  const [savedFileBody, setSavedFileBody] = useState<string>("");
  const separator = "---\n";

  const saveFileBody = async (
    lessonId: string,
    filename: string,
    body: string,
    regenThumb: boolean
  ) => {
    const fileHeader = rawMdFileContent.split(separator)[1];
    const newRawText = ["", fileHeader, body].join(separator);
    await saveMdText(lessonId, filename, newRawText, regenThumb);
    setRawMdFileContent(newRawText);
    setSavedFileBody(body);
  };

  const saveDefaultFileBody = async (lessonId: string, filename: string) => {
    const ymlData = await getYmlData();
    const defaultFileBody = createDefaultFileBody(filename, ymlData);
    await saveFileBody(lessonId, filename, defaultFileBody, true);
  };

  useEffect(() => {
    async function fetchData() {
      const result = await fetchMdText(lessonId, file);
      // eslint-disable-next-line
      const [_, header, body] = result.split(separator);
      setRawMdFileContent(result);
      setSavedFileBody(body);
      setHeaderData(yamlHeaderLoad(header, language));
      console.log("FileContext done loading...");
      if (!body || body.trim().length === 0) {
        await saveDefaultFileBody(lessonId, file);
      }
    }

    if (lessonId && file) {
      fetchData().then();
    }
    // eslint-disable-next-line
  }, [lessonId, file, language]);

  const saveFileHeader = async (lessonId: string, filename: string, data: HeaderData) => {
    const fileBody = rawMdFileContent.split(separator)[2];
    const header = yamlHeaderDump(data);
    const newRawText = ["", header, fileBody].join(separator);
    await saveMdText(lessonId, filename, newRawText);
    setRawMdFileContent(newRawText);
    // @ts-ignore
    setHeaderData(yamlHeaderLoad(data, language));
  };
  const context: ContextProps = {
    headerData,
    savedFileBody,
    saveFileBody,
    saveFileHeader,
    rawMdFileContent,
    setHeaderData,
    fetchMdText,
  };
  return <FileContext.Provider value={context}>{props.children}</FileContext.Provider>;
};
const useFileContext = (): Partial<ContextProps> => useContext(FileContext);

export { useFileContext, FileContextProvider };
