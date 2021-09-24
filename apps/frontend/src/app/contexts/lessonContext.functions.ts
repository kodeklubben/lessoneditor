import {LessonDTO, NewLessonDTO} from "../../../../../libs/lesson/src/lib/lesson.dto"

export interface LessonContextState
{
  lesson: LessonDTO | undefined,
  files: string[] | undefined
  yml: YamlFields
}

export interface YamlFields{
  level: number,
  license: string,
  tags: any
}

export interface LessonContextModel
{
    state: LessonContextState,
    updateLesson: (lessonId: number, data: NewLessonDTO) => void
    updateYaml: (lessonId: number, data: YamlFields) => void
}



export const initalLessonContextState: LessonContextState = {
    lesson: undefined,
    files: undefined,
    yml: {
        level: 1,
        license: "CC BY-SA 4.0",
        tags: { topic: [], subject: [], grade: [] },
    }
}

