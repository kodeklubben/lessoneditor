import React, { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { getLessonPaths } from "./utils/get-lesson-paths";
import { NewLessonDTO, LessonDTO, FileDTO, YamlContent } from "@lessoneditor/contracts";
import { LessonContextState, LessonContextModel } from "./lessonContext.functions";
import ShowSpinner from "../components/ShowSpinner";
import { paths } from "@lessoneditor/api-interfaces";
import { useUserContext } from "./UserContext";
import { base64StringToBlob, createObjectURL } from "blob-util";

const LessonContext = React.createContext<LessonContextModel>({} as LessonContextModel);

export const LessonContextProvider = (props: any) => {
  const { state } = useUserContext();
  const { lessonId } = useParams() as any;
  const { lessonDataPath, lessonYamlPath, lessonFilesPath } = getLessonPaths(lessonId);

  const [lesson, setLesson] = useState<LessonDTO | undefined>(undefined);
  const [files, setFiles] = useState<string[]>([]);
  const [images, setImages] = useState({});
  const [yml, setYml] = useState<any>({
    level: 1,
    license: "CC BY-SA 4.0",
    tags: { grade: [], subject: [], topic: [] },
  });

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

        for (const file of fileNames.data) {
          const ext = file.split(".").pop() === "jpg" ? "jpeg" : file.split(".").pop() ?? "";
          if (!/^[\w-]+(.jpg|.jpeg|.gif|.png)$/i.test(file)) {
            continue;
          }
          const url = paths.LESSON_FILE.replace(":lessonId", lessonId).replace(
            ":fileName",
            file.split(".")[0]
          );

          const imageRes: any = await axios.get(url);
          setImages((prevImages) => ({
            ...prevImages,
            [file]: createObjectURL(base64StringToBlob(imageRes.data, `image/${ext}`)),
          }));
        }

        // for (const file2 of fileNames.data) {
        //   const url = paths.LESSON_FILE.replace(":lessonId", lessonId).replace(
        //     ":fileName",
        //     file2.split(".")[0]
        //   );

        //   const fileRes: any = await axios.get(url);
        //   console.log(fileRes);
        // }

        setFiles(fileNames.data);
        setYml(yamlFile.data.content);
        setLesson(lesson.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchLessonData();
  }, []);

  const fetchYmlData = async () => {
    const lessonYMLDataRes = await axios.get(lessonYamlPath);
    return lessonYMLDataRes.data;
  };

  const updateYaml = async (lessonId: string, data: YamlContent) => {
    try {
      const updatedFile = await axios.put<FileDTO<YamlContent>>(
        paths.LESSON_FILE_UPDATE.replace(":lessonId", lessonId).replace(":fileName", "lesson"),
        data
      );
      setYml(updatedFile.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const updatelesson = async (data: NewLessonDTO) => {
    const savedLesson = await axios.put<LessonDTO>(
      paths.USER_LESSON_UPDATE.replace(":userId", state.user!.userId.toString()),
      data
    );
    setLesson(savedLesson.data);
  };

  if (!lesson) {
    return <ShowSpinner></ShowSpinner>;
  }

  const lessonState: LessonContextState = {
    lesson: lesson,
    files: files,
    yml: yml,
  };

  const context: LessonContextModel = {
    state: lessonState,
    yml,
    setYml: setYml,
    updateLesson: updatelesson,
    updateYaml: updateYaml,
    images,
    setImages,
  };

  return (
    <>
      <LessonContext.Provider value={context}>{props.children}</LessonContext.Provider>
    </>
  );
};
export const useLessonContext = (): LessonContextModel => useContext(LessonContext);
