import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import axios from "axios";
import { Container, Message } from "semantic-ui-react";

import { LessonDTO, FileDTO, YamlContent, splitFilename } from "@lessoneditor/contracts";
import { LessonContextState, LessonContextModel } from "./lessonContext.functions";
import ShowSpinner from "../components/ShowSpinner";
import { paths } from "@lessoneditor/contracts";
import { base64StringToBlob, createObjectURL } from "blob-util";
import { load } from "js-yaml";
import { failedImageUrl, loadingImageUrl } from "../utils/imageSkeleton";

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

  /** Each image takes the place of its stand-in when it arrives. */
  const loadImages = (imageFiles: string[], isCopy: boolean, isActive: () => boolean) => {
    for (const file of imageFiles) {
      const { filename, ext } = splitFilename(file);
      axios
        .get<string>(
          // With the extension: a lesson from the repo can have asteroids.md and
          // asteroids.png.
          paths.LESSON_FILE.replace(":lessonId", lessonId).replace(
            ":filename",
            encodeURIComponent(filename + ext),
          ),
        )
        .then(({ data }) => createObjectURL(base64StringToBlob(data, IMAGE_TYPES[ext])))
        .then(
          (url) =>
            isActive() && setImages((prev: Record<string, string>) => ({ ...prev, [file]: url })),
          () => {
            if (!isActive()) return;
            setImages((prev: Record<string, string>) => {
              // A copy's preview shows a missing image from GitHub instead.
              if (!isCopy) return { ...prev, [file]: failedImageUrl() };
              const { [file]: _missing, ...rest } = prev;
              return rest;
            });
          },
        );
    }
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
        if (!active) return;
        // The page is shown now; each image takes the place of its stand-in when it arrives.
        // Waiting for all of them held the page for up to 7 s (22 images, 3.6 MB).
        const imageFiles = filenames.filter((file) => IMAGE_TYPES[splitFilename(file).ext]);
        setImages(Object.fromEntries(imageFiles.map((file) => [file, loadingImageUrl()])));
        setYml(yamlFile.data.content);
        setLesson(lessonRes.data);
        setFiles(filenames);
        setLoading(false);

        loadImages(imageFiles, Boolean(lessonRes.data.upstream_path), () => active);
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

  // The same lesson on the next page (from the editor back to the lesson page, say): React keeps
  // this provider, so its title, files and lesson.yml are read again in the background. Images
  // already shown stay; only new ones are fetched.
  const { pathname } = useLocation();
  const routed = useRef(false);
  useEffect(() => {
    if (!routed.current) {
      routed.current = true;
      return;
    }
    let active = true;
    Promise.all([
      axios.get<LessonDTO>(paths.LESSON.replace(":lessonId", lessonId)),
      axios.get<FileDTO<YamlContent>>(
        paths.LESSON_FILE.replace(":lessonId", lessonId).replace(":filename", "lesson"),
      ),
      fetchFileList(),
    ]).then(
      ([lessonRes, yamlFile, filenames]) => {
        if (!active) return;
        setLesson(lessonRes.data);
        setYml(yamlFile.data.content);
        setFiles(filenames);
        const added = filenames.filter(
          (file) => IMAGE_TYPES[splitFilename(file).ext] && !(file in images),
        );
        if (!added.length) return;
        setImages((prev: Record<string, string>) => ({
          ...prev,
          ...Object.fromEntries(added.map((file) => [file, loadingImageUrl()])),
        }));
        loadImages(added, Boolean(lessonRes.data.upstream_path), () => active);
      },
      () => undefined, // what is on screen stays
    );
    return () => {
      active = false;
    };
  }, [pathname]);

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
