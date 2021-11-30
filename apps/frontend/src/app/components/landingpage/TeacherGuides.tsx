import { FC, SyntheticEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, Button, Icon, Divider, Dropdown } from "semantic-ui-react";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import LessonCard from "./LessonCard";
import axios from "axios";
import { paths } from "@lessoneditor/api-interfaces";
import { NewFileDTO, HeaderData } from "@lessoneditor/contracts";
import { filenameParser } from "../../utils/filename-parser";
import * as yaml from "js-yaml";

const TeacherGuides: FC<any> = ({ lessonId, fileList, lessonSlug, lessonTitle }) => {
  const [usedLanguages, setUsedLanguages] = useState<string[]>([]);
  const unusedLanguages = LANGUAGEOPTIONS.filter((item) => !usedLanguages.includes(item.value));

  console.log({ lessonId, fileList });

  const [lang, setLang] = useState<string>(unusedLanguages[0].value);
  const navigate = useNavigate();

  useEffect(() => {
    fileList.forEach((filename: string) => {
      const { isMarkdown, isReadme, language } = filenameParser(filename);
      console.log({ filename, isMarkdown, isReadme, language });

      if (isReadme && unusedLanguages.length > 0) {
        setUsedLanguages((prevLang) => [...prevLang, language]);
      }
    });
  }, []);

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
      const filename = lang === "nb" ? "README" : `README_${lang}`;
      const newFileDTO: NewFileDTO = {
        filename,
        ext: ".md",
        content: rawBody,
      };
      const newLessonFileRes = await axios.post<number>(
        paths.LESSON_FILES.replace(":lessonId", lessonId),
        newFileDTO
      );
    } catch (e) {
      console.error(e);
    }

    const target = ["/editor", lessonId, "README", lang].join("/");
    navigate(target);
  };

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    setLang(value);
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
      </Card.Group>
    </>
  );
};

export default TeacherGuides;
