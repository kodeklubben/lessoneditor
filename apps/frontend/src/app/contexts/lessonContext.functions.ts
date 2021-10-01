import {LessonDTO, NewLessonDTO, FileDTO, YamlContent} from "../../../../../libs/lesson/src/lib/lesson.dto"

export interface LessonContextState
{
  lesson: LessonDTO | undefined,
  files: string[] | undefined
  yml: FileDTO<YamlContent> | undefined
}


export interface LessonContextModel
{
    state: LessonContextState,
    setLessonContextState: React.Dispatch<React.SetStateAction<LessonContextState>>
    updateLesson: (lessonId: number, data: NewLessonDTO) => void
    updateYaml: (lessonId: number, data: YamlContent) => void
}



export const initalLessonContextState: LessonContextState = {
    lesson: undefined,
    files: undefined,
    yml: undefined
}

