import { FileDTO } from "libs/lesson/src/lib/lesson.dto";
import { HeaderData } from "./FileContext";

export interface FileContextState
{
    markDown: FileDTO<string> | undefined,
    rawMdFileContent: string | undefined,
    savedFileBody: string | undefined,
    headerData: HeaderData 
    
}

export interface FileContextModel
{
    state: FileContextState,
    saveFileBody: (body: string) => void,
    saveFileHeader: (data: HeaderData) => void
    setFileContextState: React.Dispatch<React.SetStateAction<FileContextState>>
}

export const initialFileContextState: FileContextState = {
    markDown: undefined,
    rawMdFileContent: undefined,
    savedFileBody: undefined,
    headerData: {
        title: "",
        authorList: [],
        translatorList: [],
        language: "nb",
        author: false,
        translator: false
  }

} 