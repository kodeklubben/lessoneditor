import { LessonDTO, FileDTO } from "../../../../../../libs/lesson/src/lib/lesson.dto"
import React, {useEffect, useState} from "react"
import { Button, Card, Image } from "semantic-ui-react";
import { paths } from "@lessoneditor/api-interfaces";
import axios from "axios";

interface Props
{
    lesson: LessonDTO
    removeLesson: (lessonId: number) => void;
    navigateToHome: (lessonId: string) => void;
}

const Item: React.FC<Props> = (props: Props) => 
{
    const {lesson, removeLesson, navigateToHome} = props
    const [image, setImage] = useState<FileDTO<string>>()

    useEffect(() => 
    {
        async function getImage()
        {
            try
            {
                const file = await axios.get<FileDTO<string>>(paths.LESSON_FILE.replace(":lessonId",lesson.lessonId.toString()).replace(":fileName","preview"))
                setImage(file.data)
            }
            catch(error)
            {
                console.error(error)
            }
        }
    })

    return(
    <>
        <Card key={"listitem" + lesson.lessonId}>
              <Card.Content>
                <Image
                  src={`${image?.content}?${performance.now()}`}
                  size="medium"
                  bordered
                  rounded
                  style={{
                    maxHeight: "220px",
                    overflow: "hidden",
                    objectFit: "cover",
                    objectPosition: "0 0",
                  }}
                />
              </Card.Content>
              <Card.Content>
                <Card.Header>
                  {lesson.lessonTitle ? lesson.lessonTitle : lesson.lessonSlug}
                </Card.Header>
                <Card.Meta>
                  {lesson.courseTitle ? lesson.courseTitle : lesson.courseSlug}
                </Card.Meta>
              </Card.Content>

              <Card.Content extra>
                <Button onClick={() => navigateToHome(lesson.lessonId.toString())} positive>
                  Åpne
                </Button>
                <Button
                  color="black"
                  onClick={() => {
                    removeLesson(lesson.lessonId);
                  }}
                >
                  Fjerne
                </Button>
              </Card.Content>
            </Card>
            </>
    )

}

export default Item