import { LessonDTO, NewLessonDTO, YamlContent } from "@libs/lesson/src/lib/lesson.dto";

export interface LessonContextState {
  lesson: LessonDTO ;
  files: string[];
  yml: YamlContent;
}

export interface LessonContextModel {
  state: LessonContextState;
  setYml: React.Dispatch<React.SetStateAction<YamlContent>>;
  updateLesson: (data: NewLessonDTO) => void;
  updateYaml: (lessonId: string, data: YamlContent) => void;
}

