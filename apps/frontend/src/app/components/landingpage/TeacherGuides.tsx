import LessonCard from "./LessonCard";

import { Card } from "semantic-ui-react";
import { FC } from "react";
import { filenameParser } from "../../utils/filename-parser";

const TeacherGuides: FC<any> = ({ lessonId, lessonList, lessonTitle }) => {
  const languages: string[] = [];

  lessonList.forEach((filename: string) => {
    const { isMarkdown, isReadme, language } = filenameParser(filename);
    if (!isMarkdown) {
      return;
    }
    if (isReadme && !languages.includes(language)) languages.push(language);
  });

  const allLanguages = ["nb", "nn", "en", "is"];

  return (
    <>
      <Card.Group centered>
        {allLanguages.map((language) => {
          return (
            <LessonCard
              key={lessonId}
              content={"Lærerveiledning"}
              language={language}
              hasContent={languages.includes(language)}
              lessonId={lessonId}
              lessonSlug={"README"}
              lessonTitle={lessonTitle}
            />
          );
        })}
      </Card.Group>
    </>
  );
};

export default TeacherGuides;
