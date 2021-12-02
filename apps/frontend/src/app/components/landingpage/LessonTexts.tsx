import LessonCard from "./LessonCard";
import { Card, Divider, Icon, Button, Dropdown } from "semantic-ui-react";
import { useNavigate } from "react-router";
import { FC, SyntheticEvent, useState, useEffect } from "react";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import axios from "axios";
import { paths } from "@lessoneditor/api-interfaces";
import { NewFileDTO, HeaderData } from "@lessoneditor/contracts";
import { filenameParser } from "../../utils/filename-parser";
import * as yaml from "js-yaml";

const LessonTexts: FC<any> = ({ lessonId, fileList, lessonSlug, lessonTitle }) => {
  const [usedLanguages, setUsedLanguages] = useState<string[]>([]);
  const unusedLanguages = LANGUAGEOPTIONS.filter((item) => !usedLanguages.includes(item.value));
  const [lang, setLang] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    fileList.forEach((filename: string) => {
      const { isMarkdown, isReadme, language } = filenameParser(filename);

      if (!isReadme && language.length > 0) {
        setUsedLanguages((prevLang) => [...prevLang, language]);
      }
    });
  }, []);

  useEffect(() => {
    setLang(unusedLanguages[0].value);
  }, [unusedLanguages[0].value]);

  const header: HeaderData = {
    title: lessonTitle,
    author: "",
    authorList: [],
    language: lang,
    translator: "",
    translatorList: [],
  };

  const rawBody = "---\n" + yaml.dump(header) + "---\n" + "\n#testTekst";

  const onSubmit = async () => {
    try {
      const filename = lang === "nb" ? lessonSlug : `${lessonSlug}_${lang}`;
      const newLessonFileDTO: NewFileDTO = {
        filename,
        ext: ".md",
        content: rawBody,
      };
      const newLessonFileRes = await axios.post<number>(
        paths.LESSON_FILES.replace(":lessonId", lessonId),
        newLessonFileDTO
      );
    } catch (e) {
      console.error(e);
    }

    const target = ["/editor", lessonId, lessonSlug, lang].join("/");

    navigate(target);
  };

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    setLang(value);
  };

  return (
    <>
      <Card.Group centered>
        {usedLanguages.map((language: string) => {
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
                <Button onClick={onSubmit} content="Ny tekstfil " />
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
