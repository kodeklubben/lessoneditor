import LessonCard from "./LessonCard";
import { Card, Divider, Icon, Button, Dropdown } from "semantic-ui-react";
import { useNavigate } from "react-router";
import { FC, SyntheticEvent, useState } from "react";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { filenameParser } from "../../utils/filename-parser";

const LessonTexts: FC<any> = ({ lessonId, fileList, lessonSlug, lessonTitle, languages }) => {
  const navigate = useNavigate();

  const unusedLanguages = LANGUAGEOPTIONS.filter((item) => !languages.includes(item.value)) ?? "";
  const [lang, setLang] = useState<string>(unusedLanguages[0].value);
  const navigateToEditor = (lessonId: any, lessonSlug: any) => {};

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    setLang(value);
    console.log(lang);
  };

  return (
    <>
      <Card.Group centered>
        {languages.map((language: string) => {
          return (
            <LessonCard
              key={language}
              content={"Oppgavetekst"}
              language={language}
              lessonId={lessonId}
              lessonSlug={lessonSlug}
              lessonTitle={lessonTitle}
            />
          );
        })}
        {unusedLanguages ? (
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
                <Card.Meta>{"Oppgavetekst"}</Card.Meta>
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
        ) : (
          ""
        )}
      </Card.Group>
    </>
  );
};

export default LessonTexts;
