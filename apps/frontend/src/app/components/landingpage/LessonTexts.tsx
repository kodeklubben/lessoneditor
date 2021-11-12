import LessonCard from "./LessonCard";
import { Card } from "semantic-ui-react";
import { FC } from "react";
import { filenameParser } from "../../utils/filename-parser";

const LessonTexts: FC<any> = ({ lessonId, lessonList, lessonSlug, lessonTitle }) => {
  const languages: string[] = [];

  lessonList.forEach((filename: string) => {
    const { isMarkdown, isReadme, language } = filenameParser(filename);
    if (!isMarkdown) {
      return;
    }
    if (!isReadme && !languages.includes(language)) languages.push(language);
  });

  const allLanguages = ["nb", "nn", "en", "is"];

  return (
    <>
      <Card.Group centered>
        {allLanguages.map((language) => {
          return (
            <LessonCard
              key={language}
              content={"Oppgavetekst"}
              language={language}
              hasContent={languages.includes(language)}
              lessonId={lessonId}
              lessonSlug={lessonSlug}
              lessonTitle={lessonTitle}
            />
          );
        })}
      </Card.Group>
    </>
  );
};

export default LessonTexts;
