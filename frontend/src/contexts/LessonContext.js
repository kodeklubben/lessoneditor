import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import resolveUrlTemplate from "../utils/resolve-url-template";
import paths from "../paths.json";

export const LessonContext = React.createContext({});

export const LessonContextProvider = (props) => {
  const { lessonId } = useParams();
  const [data, setData] = useState({ header: {} });
  const [headerData, setHeaderData] = useState({});
  const [lessonList, setLessonList] = useState({});
  const [language, setLanguage] = useState("nb");

  const lessonListUrl = resolveUrlTemplate(paths.LESSON_FILES, { lessonId });
  const lessonDataUrl = resolveUrlTemplate(paths.LESSON_DATA, { lessonId });

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
    setData,
    headerData,
    setHeaderData,
    fetchList: async () => {
      const res = await axios.get(lessonListUrl);
      setLessonList(res.data);
    },
    lessonList,
    setLang: async (language) => {
      const defaultState = {
        title: "",
        titleErr: "",
        author: "",
        authorList: [],
        authorErr: "",
        translator: "",
        translatorList: [],
      };
      if (!headerData[language]) {
        setHeaderData((prevState) => ({
          ...prevState,
          [language]: defaultState,
        }));
      }
      if (!data["header"][language]) {
        setData((prevState) => ({
          ...prevState,
          ["header"]: { [language]: defaultState },
        }));
      }
      setLanguage(language);
    },
    saveLesson: async (data) => {
      if (lessonId) {
        await axios.post(lessonDataUrl, data);
        setData(data);
      }
    },
    getLessonData: async (data) => {
      if (lessonId) {
        const res = await axios.get(lessonDataUrl);
        setData(res.data);
      }
    },
    language,
    setLanguage,
  };
  return (
    <>
      <LessonContext.Provider value={context}>
        {props.children}
      </LessonContext.Provider>
    </>
  );
};
