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
  updateThumbnail: () => Promise<void>;
  saveFileHeader: (data: HeaderData) => Promise<number>;
  setFileContextState: React.Dispatch<React.SetStateAction<FileContextState>>;
  loading: boolean;
}

export const initialFileContextState: FileContextState = {
  rawMdFileContent: undefined,
  savedFileBody: undefined,
  headerData: {
    title: "",
    author: "",
    authorList: [],
    translator: "",
    translatorList: [],
    language: "nb",
  },
};
