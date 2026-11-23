import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { Container, Message } from "semantic-ui-react";
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
  // The server's version of that text. Saves send it along, and the server refuses a save over
  // a text someone saved meanwhile (409) instead of silently replacing their work.
  const versionRef = useRef<string | undefined>(undefined);

  const filename = lang === "nb" ? file : typeof lang !== "undefined" ? `${file}_${lang}` : file;
  const fileUrl = paths.LESSON_FILE_UPDATE.replace(":lessonId", String(lessonId)).replace(
    ":filename",
    filename,
  );

  /** Reads the text from the server; also to take another tab's version after a conflict. */
  const fetchFile = useCallback(async () => {
    const result = await axios.get<FileDTO<string>>(
      paths.LESSON_FILE.replace(":lessonId", lessonId).replace(":filename", filename),
    );
    const { data: headerData, body } = parseLessonMarkdown<HeaderData>(result.data.content);
    rawRef.current = result.data.content;
    versionRef.current = result.data.version;
    setFileContextState((s) => ({
      ...s,
      rawMdFileContent: result.data.content,
      savedFileBody: body,
      headerData: headerData,
    }));
    setSavedFileBody(body);
    return body;
  }, [lessonId, filename]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setLoadError(false);
        await fetchFile();
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

  /** Writes the whole file; the answer's status: 200, 409 (changed elsewhere), 404, or -1. */
  const putFile = useCallback(
    async (content: string) => {
      try {
        const saved = await axios.put<FileDTO<string>>(fileUrl, {
          content,
          base: versionRef.current,
        });
        rawRef.current = content;
        versionRef.current = saved.data.version;
        return saved.status;
      } catch (error) {
        const status = (error as { response?: { status?: number } })?.response?.status;
        if (status === 409 || status === 404) return status;
        console.error("Saving failed", error);
        return -1;
      }
    },
    [fileUrl],
  );

  /** After a conflict, when the user keeps their own text: the next save replaces the other. */
  const forgetVersion = useCallback(() => {
    versionRef.current = undefined;
  }, []);

  const saveFileHeader = async (data: HeaderData) => {
    const status = await putFile(
      stringifyLessonMarkdown(data, parseLessonMarkdown(rawRef.current).body),
    );
    if (status === 200)
      setFileContextState((s) => ({ ...s, rawMdFileContent: rawRef.current, headerData: data }));
    return status;
  };

  /** Saves only the text. The thumbnail is separate (updateThumbnail), see K5. */
  const saveFileBody = useCallback(
    async (body: string) => {
      if (typeof body !== "string" || body === "") {
        return -1;
      }
      const newRawText = replaceLessonBody(rawRef.current, body);
      const status = await putFile(newRawText);
      if (status === 200) {
        setFileContextState((s) => ({ ...s, rawMdFileContent: newRawText, savedFileBody: body }));
      }
      return status;
    },
    [putFile],
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
          // With the version: a closing tab must not replace what another tab saved meanwhile.
          body: JSON.stringify({ content, base: versionRef.current }),
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
      return (await axios.put<boolean>(url)).data === true;
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
    reloadFile: fetchFile,
    forgetVersion,
  };

  if (loadError) {
    // Usually a text that was deleted, or a language or name in the address that does not exist;
    // reloading does not help, the lesson page does.
    return (
      <Container style={{ marginTop: "3em" }}>
        <Message negative role="alert">
          <Message.Header>Fant ikke teksten</Message.Header>
          <p>Den kan være slettet, eller adressen peker på et språk oppgaven ikke har.</p>
          <Link to={`/landingpage/${lessonId}`}>Til oppgaven</Link>
        </Message>
      </Container>
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
