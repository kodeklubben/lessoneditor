import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import saveMdText from "../api/save-md-text";
import insertMetaDataInTeacherGuide from "../components/editor/utils/insertMetaDataInTeacherGuide";
import oppgaveMal from "../components/editor/settingsFiles/oppgaveMal";
import { useLessonContext } from "./LessonContext";
import { filenameParser } from "../utils/filename-parser";
import axios from "axios";
import {paths} from "@lessoneditor/api-interfaces"
import {FileDTO, HeaderData, UpdatedFileDTO } from "../../../../../libs/lesson/src/lib/lesson.dto"
import { YamlContent } from "../../../../../libs/lesson/src/lib/lesson.dto"
import { FileContextModel, FileContextState, initialFileContextState } from "./fileContext.functions";
import {useUserContext} from "./UserContext"
import * as yml from "js-yaml"



const FileContext = React.createContext<FileContextModel>({} as FileContextModel);

function createDefaultFileBody(file: string, ymlData: YamlContent) {
  const { isReadme } = filenameParser(file);
  return isReadme ? insertMetaDataInTeacherGuide(ymlData) : oppgaveMal;
}

const FileContextProvider = (props: any) => {

  const [fileContextState, setFileContextState] = useState<FileContextState>(initialFileContextState)
  const { lessonId, file } = useParams<any>();
  const {state: userState} = useUserContext();
  const { state } = useLessonContext();
  const { language } = filenameParser(file);

  const separator = "---\n";

  const saveFileBody = async (
    body: string
  ) => {
    const fileHeader = fileContextState.rawMdFileContent?.split(separator)[1];
    const newRawText = ["", fileHeader, body].join(separator);
    try
    {
      const updatedFile: UpdatedFileDTO = 
      {
        content: newRawText
      }
      const uploadedFile = await axios.put<FileDTO<string>>(paths.LESSON_FILE_UPDATE
        .replace(":lessonId", lessonId.toString())
        .replace(":fileName",file),updatedFile)
        setFileContextState((s) =>
    {
      return{
        ...s,
        rawMdFileContent: newRawText,
        savedFileBody: body   
      }
    })
    }
    catch(error)
    {
      console.error(error)
    }
    
  };


  useEffect(() => {
    async function fetchData() {
      try
      {
        const result = await axios.get<FileDTO<string>>(paths.LESSON_FILE.replace(":lessonId",lessonId).replace(":fileName",file))
        // eslint-disable-next-line
        const [_, header, body] = result.data.content.split(separator);

        const headerData = yml.load(header) as HeaderData
        setFileContextState((s) =>
        {
          return{
            ...s,
            rawMdFileContent: result.data.content,
            savedFileBody: body,
            headerData: headerData
          }
        })
      }
      catch(error)
      {
        console.error(error);
      }

    }

    if (lessonId && file) {
      fetchData().then();
    }
    // eslint-disable-next-line
  }, [lessonId, file, language]);

  const saveFileHeader = async (
    data: HeaderData
  ) => {
    const fileBody = fileContextState?.rawMdFileContent?.split(separator)[2];
    const header = yml.dump(data)
    const newRawText = ["", header, fileBody].join(separator);
    try
    {
      const updatedFile: UpdatedFileDTO = 
      {
        content: newRawText
      }
      const newFile = await axios.put<FileDTO<UpdatedFileDTO>>(paths.LESSON_FILE_UPDATE
        .replace(":lessonId", lessonId.toString())
        .replace(":fileName",file), updatedFile)
        setFileContextState((s) =>
    {
      return{
        ...s,
        rawMdFileContent: newRawText,
        headerData: data
      }
    })
    }
    catch(error)
    {
      console.error(error)
    }
  };

  const context: FileContextModel = {
    state: fileContextState,
    saveFileBody,
    saveFileHeader,
    setFileContextState
  };
  return (
    <FileContext.Provider value={context}>
      {props.children}
    </FileContext.Provider>
  );
};
const useFileContext = (): FileContextModel => useContext(FileContext);

export { useFileContext, FileContextProvider };
