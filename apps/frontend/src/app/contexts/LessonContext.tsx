import React, { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { getLessonPaths } from "./utils/get-lesson-paths";

const emptyLessonData = {
  course: "",
  courseTitle: "",
  created: "",
  createdBy: "",
  lesson: "",
  lessonId: "",
  lessonTitle: "",
  updated: "",
};

const emptyYmlData = { level: 0, license: "", tags: { grade: [], subject: [], topic: [] } };

interface Subtag {
  grade: string[];
  subject: string[];
  topic: string[];
}

interface YmlData {
  level: number;
  license: string;
  tags: Subtag;
}

interface LessonFile {
  created: string;
  filename: string;
  size: number;
  updated: string;
  url: string;
}

interface LessonData {
  course: string;
  courseTitle: string;
  created: string;
  createdBy: string;
  lesson: string;
  lessonId: string;
  lessonTitle: string;
  updated: string;
}

interface LessonContextProps {
  lessonData: LessonData;
  lessonFiles: LessonFile[];
  ymlData: YmlData;
  setYmlData: Dispatch<SetStateAction<YmlData>>;
  setLessonData: Dispatch<SetStateAction<LessonData>>;
  saveLessonData: (data: LessonData) => Promise<void>;
  saveYmlData: (data: YmlData) => Promise<void>;
  fetchYmlData: () => Promise<YmlData>;
}

const LessonContext = React.createContext<LessonContextProps>({
  lessonData: emptyLessonData,
  lessonFiles: [],
  ymlData: emptyYmlData,
  setYmlData: () => {
    return;
  },
  setLessonData: () => {
    return;
  },
  saveLessonData: async () => {
    return;
  },
  saveYmlData: async () => {
    return;
  },
  fetchYmlData: async () => {
    return emptyYmlData;
  },
});

export const LessonContextProvider: FC = (props) => {
  const { lessonId } = useParams<{ lessonId: string }>();

  const { lessonDataPath, lessonYamlPath, lessonFilesPath } = getLessonPaths(lessonId);

  const [lessonData, setLessonData] = useState<LessonData>(emptyLessonData);
  const [lessonFiles, setLessonFiles] = useState<LessonFile[]>([]);
  const [ymlData, setYmlData] = useState<YmlData>(emptyYmlData);

  useEffect(() => {
    async function fetchLessonData() {
      const lessonDataRes = await axios.get(lessonDataPath);
      const lessonFilelistRes = await axios.get(lessonFilesPath);
      const lessonYMLDataRes = await axios.get(lessonYamlPath);

      setLessonData(lessonDataRes.data);
      setLessonFiles(lessonFilelistRes.data);
      setYmlData(lessonYMLDataRes.data);
    }
    if (lessonId) {
      fetchLessonData();
    }
  }, []);

  const saveLessonData = async (data: LessonData) => {
    if (lessonId) {
      await axios.post(lessonDataPath, data);
    } else {
      console.error("No lessonId set in context aborting");
    }
  };

  const saveYmlData = async (data: YmlData) => {
    console.log({ data });
    if (lessonId) {
      await axios.post(lessonYamlPath, data);
    } else {
      console.error("No lessonId set in context aborting");
    }
  };

  const fetchYmlData = async () => {
    const lessonYMLDataRes = await axios.get(lessonYamlPath);
    return lessonYMLDataRes.data;
  };

  const context: LessonContextProps = {
    lessonData,
    lessonFiles,
    ymlData,
    setYmlData,
    setLessonData,
    saveLessonData,
    saveYmlData,
    fetchYmlData,
  };
  return (
    <>
      <LessonContext.Provider value={context}>{props.children}</LessonContext.Provider>
    </>
  );
};
export const useLessonContext = () => useContext(LessonContext);
