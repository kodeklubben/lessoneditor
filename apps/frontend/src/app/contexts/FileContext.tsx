import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { FileDTO, HeaderData, UpdatedFileDTO } from "@lessoneditor/contracts";
import { paths } from "@lessoneditor/contracts";
import {
  FileContextModel,
  FileContextState,
  initialFileContextState,
} from "./fileContext.functions";
import * as yml from "js-yaml";
import ShowSpinner from "../components/ShowSpinner";

const separator = "---\n";

const FileContext = React.createContext<FileContextModel>({} as FileContextModel);

const FileContextProvider = (props: any) => {
  const [fileContextState, setFileContextState] =
    useState<FileContextState>(initialFileContextState);
  const { lessonId, file, lang } = useParams() as any;
  const [savedFileBody, setSavedFileBody] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const filename =
          lang === "nb" ? file : typeof lang !== "undefined" ? `${file}_${lang}` : file;
        const result = await axios.get<FileDTO<string>>(
          paths.LESSON_FILE.replace(":lessonId", lessonId).replace(":filename", filename)
        );
        const [_, header, body] = result.data.content.split(separator);

        const headerData = yml.load(header) as HeaderData;
        setFileContextState((s) => {
          return {
            ...s,
            rawMdFileContent: result.data.content,
            savedFileBody: body,
            headerData: headerData,
          };
        });
        setSavedFileBody(body);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    if (lessonId && file) {
      fetchData();
    }
  }, [lessonId, lang]);

  const saveFileHeader = async (data: HeaderData) => {
    const fileBody = fileContextState?.rawMdFileContent?.split(separator)[2];

    const header = yml.dump(data);
    const newRawText = ["", header, fileBody].join(separator);
    try {
      const updatedFile: UpdatedFileDTO = {
        content: newRawText,
      };
      const filename = lang === "nb" ? file : `${file}_${lang}`;
      const newFile = await axios.put<FileDTO<UpdatedFileDTO>>(
        paths.LESSON_FILE_UPDATE.replace(":lessonId", lessonId.toString()).replace(
          ":filename",
          filename
        ),
        updatedFile
      );

      setFileContextState((s) => {
        return {
          ...s,
          rawMdFileContent: newRawText,
          headerData: data,
        };
      });
      return newFile.status;
    } catch (error) {
      console.error(error);
      return -1;
    }
  };

  const saveFileBody = async (body: string) => {
    if (typeof body !== "string" || body === "") {
      console.error("Invalid body");
      return -1;
    }
    const fileHeader = fileContextState.rawMdFileContent?.split(separator)[1] || "";
    const newRawText = ["", fileHeader, body].join(separator);

    try {
      const updatedFile: UpdatedFileDTO = {
        content: newRawText,
      };

      const filename = lang === "nb" ? file : `${file}_${lang}`;
      const updateUrl = paths.LESSON_FILE_UPDATE.replace(":lessonId", lessonId.toString()).replace(
        ":filename",
        filename
      );
      const uploadedFile = await axios.put<FileDTO<string>>(updateUrl, updatedFile);

      if (uploadedFile.status !== 200) {
        console.error("Failed to update file", uploadedFile.status, uploadedFile.data);
        return -1;
      }

      const thumbUpdateUrl = paths.LESSON_FILE_UPDATE_THUMB.replace(
        ":lessonId",
        lessonId.toString()
      ).replace(":filename", filename);
      const isThumbUpdated = await axios.put<boolean>(thumbUpdateUrl);

      if (!isThumbUpdated.data) {
        console.error("Failed to update thumbnail");
        return -1;
      }

      setFileContextState((s) => {
        return {
          ...s,
          rawMdFileContent: newRawText,
          savedFileBody: body,
        };
      });
      return uploadedFile.status;
    } catch (error) {
      console.error("An error occurred", error);
      return -1;
    }
  };

  const context: FileContextModel = {
    state: fileContextState,
    saveFileBody,
    savedFileBody,
    saveFileHeader,
    setFileContextState,
    loading,
  };

  if (context.state.savedFileBody || context.state.savedFileBody === "") {
    return <FileContext.Provider value={context}>{props.children}</FileContext.Provider>;
  } else {
    return <ShowSpinner />;
  }
};
const useFileContext = (): FileContextModel => useContext(FileContext);

export { useFileContext, FileContextProvider };
