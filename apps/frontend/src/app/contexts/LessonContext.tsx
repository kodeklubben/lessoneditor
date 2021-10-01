import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { getLessonPaths } from "./utils/get-lesson-paths";
import {NewLessonDTO,LessonDTO,FileDTO, YamlContent} from "../../../../../libs/lesson/src/lib/lesson.dto"
import {LessonContextState, initalLessonContextState,LessonContextModel} from "./lessonContext.functions"
import {paths} from "../../../../../libs/api-interfaces/src/lib/api-interfaces"
import {useUserContext} from "./UserContext"

interface LessonContextProps {}



const LessonContext = React.createContext<LessonContextModel>({} as LessonContextModel);

export const LessonContextProvider = (props: any) => {

  const { state } = useUserContext();
  const { lessonId } = useParams<any>();
  const { lessonDataPath, lessonYamlPath, lessonFilesPath } = getLessonPaths(lessonId);
  const [lessonContextState, setLessonContextState] = useState<LessonContextState>(initalLessonContextState);

  useEffect(() => {
    async function fetchLessonData() {
      try
      {
        const lesson = await axios.get<LessonDTO>(paths.LESSON.replace(":lessonId",lessonId))
        const fileNames = await axios.get<string[]>(paths.LESSON_FILENAMES.replace(":lessonId",lessonId))
        const yamlFile = await axios.get<FileDTO<YamlContent>>(paths.LESSON_FILE.replace(":lessonId",lessonId).replace(":fileName","lesson"))
        setLessonContextState((s) => 
        {
          return {
            ...s,
            lesson: lesson.data,
            files: fileNames.data,
            yaml: yamlFile.data
          }
        })
      }
      catch(error)
      {
        console.error(error)
      }
    }

    if (lessonId) fetchLessonData().then();
  }, [lessonId]);

const updateYaml = async (lessonId: number, data: YamlContent) => {
    try
    {
      const updatedFile = await axios.put<FileDTO<YamlContent>>(paths.LESSON_FILE_UPDATE
        .replace(":lessonId", lessonId.toString()).replace(":fileId",lessonContextState.yml!.fileId.toString()),data)
      setLessonContextState((s) => 
        {
          return {
            ...s,
            yml: updatedFile.data 
          }
        })
    }
    catch(error)
    {
      console.error(error)
    }
}

const updatelesson = async (lessonId: number, data: NewLessonDTO) => {
    const savedLesson = await axios.put<LessonDTO>(paths.USER_LESSON_UPDATE.replace(":userId", state.user!.userId.toString()),data);
    setLessonContextState((s) => 
    {
      return {
        ...s,
        lesson: savedLesson.data,
      }
    })

  } 
  const context: LessonContextModel = {
    state: lessonContextState,
    setLessonContextState: setLessonContextState,
    updateLesson: updatelesson,
    updateYaml: updateYaml
  }

  return (
    <>
      <LessonContext.Provider value={context}>{props.children}</LessonContext.Provider>
    </>
  );
};
export const useLessonContext = (): LessonContextModel => useContext(LessonContext);
