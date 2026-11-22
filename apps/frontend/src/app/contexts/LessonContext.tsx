import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Container, Message } from "semantic-ui-react";

import { LessonDTO, FileDTO, YamlContent, splitFilename } from "@lessoneditor/contracts";
import { LessonContextState, LessonContextModel } from "./lessonContext.functions";
import ShowSpinner from "../components/ShowSpinner";
import { paths } from "@lessoneditor/contracts";
import { base64StringToBlob, createObjectURL } from "blob-util";
import { load } from "js-yaml";

const LessonContext = React.createContext<LessonContextModel>({} as LessonContextModel);

const IMAGE_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
};

export const LessonContextProvider = (props: any) => {
  const { lessonId } = useParams() as any;

  const [lesson, setLesson] = useState<LessonDTO | undefined>(undefined);
  const [files, setFiles] = useState<string[]>([]);
  const [images, setImages] = useState({});
  const [yml, setYml] = useState<any>({
    level: 1,
    license: "CC BY-SA 4.0",
    tags: { grade: [], subject: [], topic: [] },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchFileList = async () => {
    const filenames = await axios.get<string[]>(
      paths.LESSON_FILENAMES.replace(":lessonId", lessonId),
    );
    return filenames.data;
  };

  useEffect(() => {
    let active = true;
    async function fetchLessonData() {
      try {
        setLoading(true);
        const [lessonRes, yamlFile, filenames] = await Promise.all([
          axios.get<LessonDTO>(paths.LESSON.replace(":lessonId", lessonId)),
          axios.get<FileDTO<YamlContent>>(
            paths.LESSON_FILE.replace(":lessonId", lessonId).replace(":filename", "lesson"),
          ),
          fetchFileList(),
        ]);
        // In parallel, before the page is shown, so the first preview (and the thumbnail) has
        // them. One that fails is just missing from the preview.
        const loaded = await Promise.all(
          filenames.map(async (file) => {
            const { filename, ext } = splitFilename(file);
            if (!IMAGE_TYPES[ext]) return null;
            try {
              const imageRes = await axios.get<string>(
                paths.LESSON_FILE.replace(":lessonId", lessonId).replace(
                  ":filename",
                  encodeURIComponent(filename),
                ),
              );
              return [file, createObjectURL(base64StringToBlob(imageRes.data, IMAGE_TYPES[ext]))];
            } catch {
              return null;
            }
          }),
        );
        if (!active) return;
        setImages(Object.fromEntries(loaded.filter((entry) => entry !== null)));
        setYml(yamlFile.data.content);
        setLesson(lessonRes.data);
        setFiles(filenames);
        setLoading(false);
      } catch (e) {
        const status = (e as { response?: { status?: number } })?.response?.status;
        if (active)
          setError(
            status === 403 || status === 404
              ? "Fant ikke oppgaven, eller du har ikke tilgang til den."
              : "Kunne ikke laste oppgaven. Prøv igjen.",
          );
      }
    }

    fetchLessonData();
    return () => {
      active = false;
    };
  }, [lessonId]);

  const updateYaml = async (lessonId: string, data: YamlContent) => {
    try {
      const updatedFile = await axios.put<FileDTO<any>>(
        paths.LESSON_FILE_UPDATE.replace(":lessonId", lessonId).replace(":filename", "lesson"),
        { content: data },
      );
      const newData: unknown = load(updatedFile.data.content);
      setYml(newData);
      return updatedFile.status;
    } catch (error) {
      console.error(error);
      return -1;
    }
  };

  // Before: an error left the spinner up for good.
  if (error) {
    return (
      <Container style={{ marginTop: "3em" }}>
        <Message negative role="alert">
          <Message.Header>{error}</Message.Header>
          <p>
            <a href="/">Til forsiden</a>
          </p>
        </Message>
      </Container>
    );
  }

  if (!lesson) {
    return <ShowSpinner />;
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
    updateYaml: updateYaml,
    images,
    setImages,
    setFiles,
    fetchFileList,
    loading,
  };

  return <LessonContext.Provider value={context}>{props.children}</LessonContext.Provider>;
};
export const useLessonContext = (): LessonContextModel => useContext(LessonContext);
