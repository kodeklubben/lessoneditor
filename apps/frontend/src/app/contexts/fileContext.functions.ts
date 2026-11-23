import { HeaderData } from "@lessoneditor/contracts";

export interface FileContextState {
  rawMdFileContent: string | undefined;
  savedFileBody: string | undefined;
  headerData: HeaderData;
}

export interface FileContextModel {
  state: FileContextState;
  saveFileBody: (body: string) => Promise<number>;
  saveFileBodyOnUnload: (body: string) => void;
  updateThumbnail: () => Promise<boolean>;
  savedFileBody: string;
  saveFileHeader: (data: HeaderData) => Promise<number>;
  setFileContextState: React.Dispatch<React.SetStateAction<FileContextState>>;
  loading: boolean;
  /** Reads the text from the server again and returns its body. */
  reloadFile: () => Promise<string>;
  /** Lets the next save replace a text that was changed elsewhere. */
  forgetVersion: () => void;
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
