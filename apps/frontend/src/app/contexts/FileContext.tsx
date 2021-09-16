import React, { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import saveMdText from "../api/save-md-text";
import fetchMdText from "../api/fetch-md-text";
import yamlHeaderDump from "./utils/yaml-header-dump";
import yamlHeaderLoad from "./utils/yaml-header-load";
import insertMetaDataInTeacherGuide from "../components/editor/utils/insertMetaDataInTeacherGuide";
import oppgaveMal from "../components/editor/settingsFiles/oppgaveMal";
import { useLessonContext } from "./LessonContext";
import { filenameParser } from "../utils/filename-parser";

const SEPERATOR = "---\n";

interface FileContextProps {
  headerData: HeaderData;
  saveFileHeader: (lessonId: string, filename: string, data: HeaderData) => Promise<void>;
  savedFileBody: string;
  saveFileBody: (
    lessonId: string,
    filename: string,
    headerData: string,
    regenThumb: boolean
  ) => Promise<void>;
  setHeaderData: Dispatch<SetStateAction<HeaderData>>;
}

export interface HeaderData {
  title: string;
  authorList: string[];
  translatorList: string[];
  translator: string;
  language: string;
  author: string;
}

const FileContext = React.createContext<FileContextProps>({
  headerData: {
    title: "",
    authorList: [],
    translatorList: [],
    translator: "",
    language: "",
    author: "",
  },
  saveFileHeader: async () => {
    return;
  },
  savedFileBody: "",
  saveFileBody: async () => {
    return;
  },
  setHeaderData: () => {
    return;
  },
});

function createDefaultFileBody(
  file: string,
  ymlData: {
    tags: { subject: string[]; topic: string[]; grade: string[] };
  }
) {
  const { isReadme } = filenameParser(file);
  return isReadme ? insertMetaDataInTeacherGuide(ymlData) : oppgaveMal;
}

const FileContextProvider: FC = (props) => {
  const { lessonId, file } = useParams<{ lessonId: string; file: string }>();
  const { fetchYmlData } = useLessonContext();
  const [rawMdFileContent, setRawMdFileContent] = useState<string>("");
  const { language } = filenameParser(file);
  const [headerData, setHeaderData] = useState<HeaderData>({
    title: "",
    authorList: [],
    translatorList: [],
    language,
    author: "",
    translator: "",
  });
  const [savedFileBody, setSavedFileBody] = useState<string>("");

  const saveFileBody = async (
    lessonId: string,
    filename: string,
    body: string,
    regenThumb: boolean
  ) => {
    const fileHeader = rawMdFileContent.split(SEPERATOR)[1];
    const newRawText = ["", fileHeader, body].join(SEPERATOR);
    await saveMdText(lessonId, filename, newRawText, regenThumb);
    setRawMdFileContent(newRawText);
  };

  const saveDefaultFileBody = async (lessonId: string, filename: string) => {
    const ymlData = await fetchYmlData();
    const defaultFileBody = createDefaultFileBody(filename, ymlData);
    setSavedFileBody(defaultFileBody);
    await saveFileBody(lessonId, filename, defaultFileBody, false);
  };

  useEffect(() => {
    let isSubscribed = true;
    async function fetchData() {
      const result = await fetchMdText(lessonId, file);
      const [_, header, body] = result.split(SEPERATOR);
      if (isSubscribed) {
        setRawMdFileContent(result);
        setSavedFileBody(body);
        setHeaderData(yamlHeaderLoad(header, language));
        console.log("FileContext done loading...");
        if (!body || body.trim().length === 0) {
          await saveDefaultFileBody(lessonId, file);
        }
      }
    }

    if (lessonId && file) {
      fetchData();
    }
    return () => {
      isSubscribed = false;
    };
  }, [file]);

  const saveFileHeader = async (lessonId: string, filename: string, data: HeaderData) => {
    const fileBody = rawMdFileContent.split(SEPERATOR)[2];
    const header = yamlHeaderDump(data);
    const newRawText = ["", header, fileBody].join(SEPERATOR);
    await saveMdText(lessonId, filename, newRawText);
    setRawMdFileContent(newRawText);
    // setHeaderData(yamlHeaderLoad(data, language));
  };
  const context: FileContextProps = {
    headerData,
    saveFileHeader,
    savedFileBody,
    saveFileBody,
    setHeaderData,
  };
  return <FileContext.Provider value={context}>{props.children}</FileContext.Provider>;
};
const useFileContext = () => useContext(FileContext);

export { useFileContext, FileContextProvider };
