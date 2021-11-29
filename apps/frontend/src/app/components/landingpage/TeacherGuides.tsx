import LessonCard from "./LessonCard";

import { Card, Button, Icon, Divider, Dropdown } from "semantic-ui-react";
import { FC, SyntheticEvent, useState, useEffect } from "react";
import { filenameParser } from "../../utils/filename-parser";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";

const TeacherGuides: FC<any> = ({ lessonId, fileList, lessonTitle, languages }) => {
  const navigateToEditor = (lessonId: any, lessonSlug: any) => {};
  const [usedLanguages, setUsedLanguages] = useState<string[]>([]);

  useEffect(() => {
    fileList.forEach((filename: string) => {
      const { isMarkdown, isReadme, language } = filenameParser(filename);

      if (isReadme) {
        setUsedLanguages((prevLang) => [...prevLang, language]);
      }
    });
  }, []);

  const unusedLanguages = LANGUAGEOPTIONS.filter((item) => !usedLanguages.includes(item.value));

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    console.log("test");
  };

  return (
    <>
      <Card.Group centered>
        {usedLanguages.map((language) => {
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
        <Card>
          <Card.Content>
            <Card.Content>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "220px",
                }}
              >
                <Icon.Group>
                  <Icon color="grey" name="file text outline" size="massive" />
                </Icon.Group>
              </div>
            </Card.Content>
            <Card.Content>
              <Divider />
            </Card.Content>
            <Card.Content>
              <Card.Header>{"Opprett ny tekstfil"}</Card.Header>
              <Card.Meta>{"Lærerveiledning"}</Card.Meta>
            </Card.Content>
            <Card.Content>
              <Divider />
            </Card.Content>
            <Card.Content extra>
              <Button onClick={navigateToEditor} content="Ny tekstfil " />
              <Dropdown
                inline
                name="language"
                defaultValue={unusedLanguages[0].value}
                onChange={onChange}
                options={unusedLanguages}
              ></Dropdown>
            </Card.Content>
          </Card.Content>
        </Card>
      </Card.Group>
    </>
  );
};

export default TeacherGuides;
