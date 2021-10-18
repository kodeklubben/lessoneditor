import { LessonDTO, NewLessonDTO, YamlContent } from "@libs/lesson/src/lib/lesson.dto";

export interface LessonContextState {
  lesson: LessonDTO;
  files: string[];
  yml: YamlContent;
}

export interface LessonContextModel {
  state: LessonContextState;
  setLessonContextState: React.Dispatch<React.SetStateAction<LessonContextState>>;
  updateLesson: (data: NewLessonDTO) => void;
  updateYaml: (lessonId: string, data: YamlContent) => void;
}

export const initalLessonContextState: LessonContextState = {
  lesson: {
    lessonId: 0,

    lessonSlug: "",

    lessonTitle: "",

    courseSlug: "",

    courseTitle: "",

    created_by: "",

    updated_by: "",

    created_at: new Date(),

    updated_at: new Date(),
  },
  files: [],
  yml: { level: 1, license: "CC BY-SA 4.0", tags: { grade: [], subject: [], topic: [] } },
};
