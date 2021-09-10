
export class LessonDTO{

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

export class ShareLessonDTO
{
    invitationToUserId: string
    invitationByUserId: string


}

export class NewLessonDTO
{
    lessonSlug: string;

    lessonTitle: string;

    courseSlug: string;

    courseTitle: string;

}

export class FileDTO
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

export class NewFileDTO
{
    filename: string;

    ext: string;

    content: string;

    createdByUserId: number;

}
export class UpdatedFileDTO
{
    fileId: number;
    
    content: string

    updatedByUserId: string
}

export class LessonFilterDTO
{
    userId?: number
}

