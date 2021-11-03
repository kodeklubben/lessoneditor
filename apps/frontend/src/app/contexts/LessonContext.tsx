import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { getLessonPaths } from "./utils/get-lesson-paths";
import {
  NewLessonDTO,
  LessonDTO,
  FileDTO,
  YamlContent,
} from "../../../../../libs/lesson/src/lib/lesson.dto";
import {
  LessonContextState,
  LessonContextModel,
} from "./lessonContext.functions";
import ShowSpinner from "../components/ShowSpinner";
import { paths } from "../../../../../libs/api-interfaces/src/lib/api-interfaces";
import { useUserContext } from "./UserContext";
import { stringify } from "querystring";

const LessonContext = React.createContext<LessonContextModel>({} as LessonContextModel);

export const LessonContextProvider = (props: any) => {
  const { state } = useUserContext();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lessonDataPath, lessonYamlPath, lessonFilesPath } = getLessonPaths(lessonId);

  const [lesson, setLesson] = useState<LessonDTO | undefined>(undefined)
  const [files, setFiles] = useState<string[]>([])
  const [yml, setYml] = useState<YamlContent>({ level: 1, license: "CC BY-SA 4.0", tags: { grade: [], subject: [], topic: [] } })

  useEffect(() => {
    async function fetchLessonData() {
      try {
        const lesson = await axios.get<LessonDTO>(paths.LESSON.replace(":lessonId", lessonId));
        const fileNames = await axios.get<string[]>(
          paths.LESSON_FILENAMES.replace(":lessonId", lessonId)
        );
        const yamlFile = await axios.get<FileDTO<YamlContent>>(
          paths.LESSON_FILE.replace(":lessonId", lessonId).replace(":fileName", "lesson")
        );
        setFiles(fileNames.data)
        setYml(yamlFile.data.content)
        setLesson(lesson.data)
   
      } catch (error) {
        console.error(error);
      }
    }

    if (lessonId) fetchLessonData().then();
  }, [lessonId]);

  const updateYaml = async (lessonId: string, data: YamlContent) => {
    try {
      const updatedFile = await axios.put<FileDTO<YamlContent>>(
        paths.LESSON_FILE_UPDATE.replace(":lessonId", lessonId.toString()).replace(
          ":fileName",
          "lesson"
        ),
        data
      );
      setYml(updatedFile.data.content)
    } catch (error) {
      console.error(error);
    }
  };

  const updatelesson = async (data: NewLessonDTO) => {
    const savedLesson = await axios.put<LessonDTO>(
      paths.USER_LESSON_UPDATE.replace(":userId", state.user!.userId.toString()),
      data
    );
    setLesson(savedLesson.data)
  };


  if(!lesson)
  {
    return <ShowSpinner></ShowSpinner>

  }
  
  const lessonState: LessonContextState = {
    lesson: lesson,
    files: files,
    yml: yml,
  };

  const context: LessonContextModel = {
    state: lessonState,
    setYml: setYml,
    updateLesson: updatelesson,
    updateYaml: updateYaml,
  };



  return (
    <>
      <LessonContext.Provider value={context}>{props.children}</LessonContext.Provider>
    </>
  );
};
export const useLessonContext = (): LessonContextModel => useContext(LessonContext);
