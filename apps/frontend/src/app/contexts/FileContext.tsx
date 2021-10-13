import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import saveMdText from "../api/save-md-text";
import yamlHeaderDump from "./utils/yaml-header-dump";
import yamlHeaderLoad from "./utils/yaml-header-load";
import insertMetaDataInTeacherGuide from "../components/editor/utils/insertMetaDataInTeacherGuide";
import oppgaveMal from "../components/editor/settingsFiles/oppgaveMal";
import { useLessonContext } from "./LessonContext";
import { filenameParser } from "../utils/filename-parser";
import axios from "axios";
import { paths } from "@lessoneditor/api-interfaces";
import { FileDTO } from "@libs/lesson/src/lib/lesson.dto";
import { YamlContent } from "@libs/lesson/src/lib/lesson.dto";
import {
  FileContextModel,
  FileContextState,
  initialFileContextState,
} from "./fileContext.functions";

export interface HeaderData {
  title: string; // tittel får vi når vi oppretter oppgaven
  authorList: string[]; //navn fra Github-konto
  translatorList: string[];
  translator: string;
  language: string;
  author: string;
}

const separator = "---\n";

const FileContext = React.createContext<FileContextModel>({} as FileContextModel);

function createDefaultFileBody(file: string, ymlData: YamlContent) {
  const { isReadme } = filenameParser(file);
  return isReadme ? insertMetaDataInTeacherGuide(ymlData) : oppgaveMal;
}

const FileContextProvider = (props: any) => {
  const [fileContextState, setFileContextState] =
    useState<FileContextState>(initialFileContextState);
  const { lessonId, file } = useParams<any>();
  const { state } = useLessonContext();
  const { language } = filenameParser(file);

  const saveFileBody = async (body: string) => {
    const fileHeader = fileContextState.rawMdFileContent?.split(separator)[1] || "";
    const newRawText = ["", fileHeader, body].join(separator);
    try {
      const file = await axios.post<FileDTO<string>>(
        paths.LESSON_FILE_UPDATE.replace(":lessonId", lessonId.toString()).replace(
          ":fileId",
          fileContextState.markDown!.fileId.toString()
        )
      );

      setFileContextState((s) => {
        return {
          ...s,
          rawMdFileContent: newRawText,
          savedFilebody: body,
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get<FileDTO<string>>(
          paths.LESSON_FILE.replace(":lessonId", lessonId).replace(":fileName", file)
        );
        const [_, header, body] = result.data.content.split(separator);
        setFileContextState((s) => {
          return {
            ...s,
            rawMdFileContent: result.data.content,
            savedFilebody: body,
            headerData: yamlHeaderLoad(header, language),
          };
        });
      } catch (error) {
        console.error(error);
      }
    }

    if (lessonId && file && state.yml) {
      fetchData().then();
    }
  }, [lessonId, file, language, state.yml]);

  const saveFileHeader = async (data: HeaderData) => {
    const fileBody = fileContextState?.rawMdFileContent?.split(separator)[2];
    const header = yamlHeaderDump(data);
    const newRawText = ["", header, fileBody].join(separator);
    try {
      const file = await axios.post<FileDTO<string>>(
        paths.LESSON_FILE_UPDATE.replace(":lessonId", lessonId.toString()).replace(
          ":fileId",
          fileContextState.markDown!.fileId.toString()
        )
      );
      setFileContextState((s) => {
        return {
          ...s,
          rawMdFileContent: newRawText,
          headerData: yamlHeaderLoad(header, language),
        };
      });
    } catch (error) {
      console.error(error);
    }
  };

  const context: FileContextModel = {
    state: fileContextState,
    saveFileBody,
    saveFileHeader,
    setFileContextState,
  };
  return <FileContext.Provider value={context}>{props.children}</FileContext.Provider>;
};
const useFileContext = (): FileContextModel => useContext(FileContext);

export { useFileContext, FileContextProvider };
