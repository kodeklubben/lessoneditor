import { HeaderData } from "@lessoneditor/contracts";

export interface FileContextState {
  rawMdFileContent: string | undefined;
  savedFileBody: string | undefined;
  headerData: HeaderData;
}

export interface FileContextModel {
  state: FileContextState;
  saveFileBody: (body: string) => Promise<number>;
  savedFileBody: string;
  saveFileHeader: (data: HeaderData) => void;
  setFileContextState: React.Dispatch<React.SetStateAction<FileContextState>>;
}

export const initialFileContextState: FileContextState = {
  rawMdFileContent: undefined,
  savedFileBody: undefined,
  headerData: {
    title: "",
    authorList: [],
    translatorList: [],
    language: "nb",
    author: "",
    translator: "",
  },
};
