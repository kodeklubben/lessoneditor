import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { FileDTO, HeaderData, UpdatedFileDTO } from "@lessoneditor/contracts";
import { paths } from "@lessoneditor/contracts";
import {
  FileContextModel,
  FileContextState,
  initialFileContextState,
} from "./fileContext.functions";
import {
  parseLessonMarkdown,
  replaceLessonBody,
  stringifyLessonMarkdown,
} from "@lessoneditor/contracts";
import ShowSpinner from "../components/ShowSpinner";
import { announceThumbnail } from "../utils/thumbnailEvents";

const FileContext = React.createContext<FileContextModel>({} as FileContextModel);

const FileContextProvider = (props: any) => {
  const [fileContextState, setFileContextState] =
    useState<FileContextState>(initialFileContextState);
  const { lessonId, file, lang } = useParams() as any;
  const [savedFileBody, setSavedFileBody] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  // The file as it is on the server. A ref, so saves started from an old render (debounce,
  // unload) never write an old header back (K2).
  const rawRef = useRef<string>("");

  const filename = lang === "nb" ? file : typeof lang !== "undefined" ? `${file}_${lang}` : file;
  const fileUrl = paths.LESSON_FILE_UPDATE.replace(":lessonId", String(lessonId)).replace(
    ":filename",
    filename,
  );

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setLoadError(false);
        const result = await axios.get<FileDTO<string>>(
          paths.LESSON_FILE.replace(":lessonId", lessonId).replace(":filename", filename),
        );
        const { data: headerData, body } = parseLessonMarkdown<HeaderData>(result.data.content);
        rawRef.current = result.data.content;
        setFileContextState((s) => ({
          ...s,
          rawMdFileContent: result.data.content,
          savedFileBody: body,
          headerData: headerData,
        }));
        setSavedFileBody(body);
      } catch (error) {
        console.error(error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }

    if (lessonId && file) {
      fetchData();
    }
  }, [lessonId, lang]);

  const saveFileHeader = async (data: HeaderData) => {
    const newRawText = stringifyLessonMarkdown(data, parseLessonMarkdown(rawRef.current).body);
    try {
      const updatedFile: UpdatedFileDTO = { content: newRawText };
      const newFile = await axios.put<FileDTO<UpdatedFileDTO>>(fileUrl, updatedFile);
      rawRef.current = newRawText;
      setFileContextState((s) => ({ ...s, rawMdFileContent: newRawText, headerData: data }));
      return newFile.status;
    } catch (error) {
      console.error(error);
      return -1;
    }
  };

  /** Saves only the text. The thumbnail is separate (updateThumbnail), see K5. */
  const saveFileBody = useCallback(
    async (body: string) => {
      if (typeof body !== "string" || body === "") {
        return -1;
      }
      const newRawText = replaceLessonBody(rawRef.current, body);
      try {
        const uploadedFile = await axios.put<FileDTO<string>>(fileUrl, { content: newRawText });
        if (uploadedFile.status !== 200) {
          console.error("Failed to update file", uploadedFile.status);
          return -1;
        }
        rawRef.current = newRawText;
        setFileContextState((s) => ({ ...s, rawMdFileContent: newRawText, savedFileBody: body }));
        return uploadedFile.status;
      } catch (error) {
        console.error("Saving failed", error);
        return -1;
      }
    },
    [fileUrl],
  );

  /** Last resort when the page is closed: a keepalive request outlives the page. */
  const saveFileBodyOnUnload = useCallback(
    (body: string) => {
      if (!body) return;
      const content = replaceLessonBody(rawRef.current, body);
      try {
        void fetch(fileUrl, {
          method: "PUT",
          keepalive: true,
          credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        }).catch(() => undefined);
      } catch {
        // Bodies over 64 kB cannot use keepalive; the unload warning covers that case.
      }
    },
    [fileUrl],
  );

  const updateThumbnail = useCallback(async () => {
    try {
      const url = paths.LESSON_FILE_UPDATE_THUMB.replace(":lessonId", String(lessonId)).replace(
        ":filename",
        filename,
      );
      const made = (await axios.put<boolean>(url)).data === true;
      if (made) announceThumbnail(Number(lessonId));
      return made;
    } catch {
      // A missing thumbnail is cosmetic; it must never block or fail saving.
      return false;
    }
  }, [lessonId, filename]);

  const context: FileContextModel = {
    state: fileContextState,
    saveFileBody,
    saveFileBodyOnUnload,
    updateThumbnail,
    savedFileBody,
    saveFileHeader,
    setFileContextState,
    loading,
  };

  if (loadError) {
    return (
      <p role="alert" style={{ padding: "2rem" }}>
        Kunne ikke hente filen. Last siden på nytt for å prøve igjen.
      </p>
    );
  }
  if (context.state.savedFileBody || context.state.savedFileBody === "") {
    return <FileContext.Provider value={context}>{props.children}</FileContext.Provider>;
  } else {
    return <ShowSpinner />;
  }
};
const useFileContext = (): FileContextModel => useContext(FileContext);

export { useFileContext, FileContextProvider };
