import { LessonDTO, NewLessonDTO, YamlContent } from "@lessoneditor/contracts";

export interface LessonContextState {
  lesson: LessonDTO;
  files: string[];
  yml: YamlContent;
}

export interface LessonContextModel {
  state: LessonContextState;
  yml: YamlContent;
  setYml: React.Dispatch<React.SetStateAction<YamlContent>>;
  updateLesson: (data: NewLessonDTO) => void;
  updateYaml: (lessonId: string, data: YamlContent) => void;
  images: any;
  setImages: React.Dispatch<React.SetStateAction<any>>;
}
