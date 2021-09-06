import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { getLessonPaths } from "./utils/get-lesson-paths";

interface LessonContextProps {}

const LessonContext = React.createContext<Partial<LessonContextProps>>({});

export const LessonContextProvider = (props: {
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | null | undefined;
}) => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lessonDataPath, lessonYamlPath, lessonFilesPath } = getLessonPaths(lessonId);
  const [lessonData, setLessonData] = useState<Record<string, unknown>>({
    files: {},
    yml: {},
  });

  useEffect(() => {
    async function fetchLessonData() {
      const lessonDataRes = await axios.get(lessonDataPath);
      const lessonListRes = await axios.get(lessonFilesPath);
      const lessonYMLDataRes = await axios.get(lessonYamlPath);
      const rootDataObj = lessonDataRes.data;
      rootDataObj.files = lessonListRes.data;
      rootDataObj.yml = lessonYMLDataRes.data;

      setLessonData(rootDataObj);
    }

    if (lessonId) fetchLessonData();
  }, []);

  const context = {
    lessonData,
    setLessonData,
    saveLesson: async (data: Record<string, unknown>) => {
      if (lessonId) {
        await axios.post(lessonDataPath, data);
        data.files = lessonData.files;
        data.yml = lessonData.yml;
        setLessonData(data);
      } else {
        console.error("No lessonId set in context aborting");
      }
    },
    saveYml: async (data: Record<string, unknown>) => {
      if (lessonId) {
        await axios.post(lessonYamlPath, data);
        lessonData.yml = data;
      } else {
        console.error("No lessonId set in context aborting");
      }
    },

    /*
    trenger getyYmlData()-metoden til å hente oppdatert ymlData når FileContext skal generere lærerveiledning.
    */
    getYmlData: async () => {
      const lessonYMLDataRes = await axios.get(lessonYamlPath);
      return lessonYMLDataRes.data;
    },
  };
  return (
    <>
      <LessonContext.Provider value={context}>{props.children}</LessonContext.Provider>
    </>
  );
};
export const useLessonContext = (): Partial<any> => useContext(LessonContext);
