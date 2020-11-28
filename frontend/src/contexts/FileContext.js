import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import saveMdText from "../api/save-md-text";
import fetchMdText from "../api/fetch-md-text";
import yamlHeaderDump from "../utils/yaml-header-dump";
import yamlHeaderLoad from "../utils/yaml-header-load";
import insertMetaDataInTeacherGuide from "../components/editor/utils/insertMetaDataInTeacherGuide";
import oppgaveMal from "../components/editor/settingsFiles/oppgaveMal";
import { LessonContext } from "./LessonContext";

export const FileContext = React.createContext({});

function createDefaultFileBody(file, ymlData) {
  return file.slice(0, 6) === "README"
    ? insertMetaDataInTeacherGuide(ymlData)
    : oppgaveMal;
}

export const FileContextProvider = (props) => {
  const { lessonId, file } = useParams();
  const { ymlData } = useContext(LessonContext);
  const [rawMdFileContent, setRawMdFileContent] = useState("");
  const language = file && file.slice(-3, -2) === "_" ? file.slice(-2) : "nb";

  const [headerData, setHeaderData] = useState({
    title: "",
    authorList: [],
    translatorList: [],
    language,
  });
  const [savedFileBody, setSavedFileBody] = useState();
  const separator = "---\n";

  const saveFileBody = async (lessonId, filename, body) => {
    const fileHeader = rawMdFileContent.split(separator)[1];
    const newRawText = ["", fileHeader, body].join(separator);
    await saveMdText(lessonId, filename, newRawText);
    setRawMdFileContent(newRawText);
    setSavedFileBody(body);
  };
  const saveDefaultFileBody = async (id, filename) => {
    const defaultFileBody = createDefaultFileBody(filename, ymlData);
    await saveFileBody(id, filename, defaultFileBody);
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
      fetchData();
    }
    // eslint-disable-next-line
  }, [lessonId, file, language]);

  const saveFileHeader = async (lessonId, filename, headerData) => {
    const fileBody = rawMdFileContent.split(separator)[2];
    const header = yamlHeaderDump(headerData);
    const newRawText = ["", header, fileBody].join(separator);
    await saveMdText(lessonId, filename, newRawText);
    setRawMdFileContent(newRawText);
    setHeaderData(yamlHeaderLoad(headerData, language));
  };
  const context = {
    headerData,
    savedFileBody,
    saveFileBody,
    saveFileHeader,
  };
  return (
    <>
      <FileContext.Provider value={context}>
        {props.children}
      </FileContext.Provider>
    </>
  );
};
