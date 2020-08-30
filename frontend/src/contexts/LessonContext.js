import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";
import paths from "../paths.json";

export const LessonContext = React.createContext({});

export const LessonContextProvider = (props) => {
  const ymlFile = "lesson.yml";

  const { lessonId } = useParams();
  const [data, setData] = useState({});
  const [headerData, setHeaderData] = useState({});
  const [language, setLanguage] = useState("nb");
  const [lessonList, setLessonList] = useState({});
  const [ymlFiles, setYmlFiles] = useState({});
  const [state, setState] = useState({});

  const lessonListUrl = resolveUrlTemplate(paths.LESSON_FILES, { lessonId });
  const lessonDataUrl = resolveUrlTemplate(paths.LESSON_DATA, { lessonId });
  const lessonYmlUrl = resolveUrlTemplate(paths.DISPLAY_FILE, {
    lessonId,
    ymlFile,
  });

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get(lessonDataUrl);
      setData(res.data);
    }
    if (lessonId) fetchData();
  }, [lessonId, lessonDataUrl]);

  useEffect(() => {
    async function fetchList() {
      const res = await axios.get(lessonListUrl);
      setLessonList(res.data);
    }
    if (lessonId) fetchList();
  }, [lessonId, lessonListUrl]);

  const context = {
    data,
    headerData,
    setHeaderData,
    language,
    setLanguage,
    state,
    setState,
    ymlFiles,
    fetchList: async () => {
      const res = await axios.get(lessonListUrl);
      setLessonList(res.data);
    },
    test: async () => {
      const res = await axios.get(lessonYmlUrl);
      setYmlFiles(res);
    },
    lessonList,
    saveLesson: async (data) => {
      if (lessonId) {
        await axios.post(lessonDataUrl, data);
        setData(data);
      }
    },
    getLessonData: async () => {
      if (lessonId) {
        const res = await axios.get(lessonDataUrl);
        if (Object.keys(res.data) > 0) {
          setData(res.data);
        }
      }
    },
  };
  return (
    <>
      <LessonContext.Provider value={context}>
        {props.children}
      </LessonContext.Provider>
    </>
  );
};
