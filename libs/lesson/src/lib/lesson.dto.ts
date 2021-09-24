
export interface LessonDTO{

    lessonId: number;

    lessonSlug: string;

    lessonTitle: string;

    courseSlug: string;

    courseTitle: string;

    created_by: string;

    updated_by: string;

    created_at: Date;

    updated_at: Date

}

export interface ShareLessonDTO
{
    invitationToUserId: string
    invitationByUserId: string


}

export interface NewLessonDTO
{
    lessonSlug: string;

    lessonTitle: string;

    courseSlug: string;

    courseTitle: string;

}

export interface FileDTO
{
    fileId: number;

    filename: string;

    ext: string;

    content: string;

    created_by: string;

    updated_by: string;

    created_at: Date;

    updated_at: Date
}

export interface NewFileDTO
{
    filename: string;

    ext: string;

    content: string;

    createdByUserId: number;

}
export interface UpdatedFileDTO
{
    fileId: number;
    
    content: string

    updatedByUserId: string
}

export interface LessonFilterDTO
{
    userId?: number
}

