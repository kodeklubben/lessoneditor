import React, { SyntheticEvent, useState, useEffect } from "react";
import {
  Card,
  Divider,
  Icon,
  Button,
  Dropdown,
  Placeholder,
  Header,
  Image,
} from "semantic-ui-react";
import { useNavigate } from "react-router";
import * as yaml from "js-yaml";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import { filenameParser } from "../../utils/filename-parser";
import axios from "axios";
import { NewFileDTO, HeaderData } from "@lessoneditor/contracts";
import { paths } from "@lessoneditor/contracts";
import { useLessonContext } from "../../contexts/LessonContext";
import { useUserContext } from "../../contexts/UserContext";
import { lessonGuideDefaultText } from "./settingsFiles/defaultTexts";

const NewLessonCard = () => {
  const [usedLanguages, setUsedLanguages] = useState<string[]>([]);
  const [unusedLanguages, setUnusedLanguages] = useState<Record<string, any>[]>([]);
  const [lang, setLang] = useState<string>("-1");

  const navigate = useNavigate();

  const { fetchFileList, setFiles, state: lessonState, loading } = useLessonContext();
  const { state: userState } = useUserContext();

  const { lessonTitle, lessonSlug, lessonId } = lessonState.lesson;
  const name = userState.user!.name;
  const username = userState.user!.username;

  useEffect(() => {
    const fetchData = async () => {
      const fileList = await fetchFileList();
      const tempUsedLang: string[] = [];
      const tempUnusedLang: Record<string, string>[] = [...LANGUAGEOPTIONS];
      fileList.forEach((filename: string) => {
        const { isReadme, language } = filenameParser(filename);

        if (!isReadme && language.length > 0) {
          tempUsedLang.push(language);
          const index = tempUnusedLang.findIndex((item) => item.value === language);
          tempUnusedLang.splice(index, 1);
        }
      });
      setUsedLanguages(tempUsedLang);
      setUnusedLanguages(tempUnusedLang);
      tempUnusedLang.length > 0 ? setLang(tempUnusedLang[0].value) : setLang("-1");
    };

    fetchData();
  }, [lessonState.files]);

  const header: HeaderData = {
    title: lessonTitle,
    author: name || username,
    authorList: [],
    language: lang,
    translator: "",
    translatorList: [],
  };

  const onSubmit = async () => {
    try {
      const rawBody = "---\n" + yaml.dump(header) + "---\n" + lessonGuideDefaultText[lang];
      const filename = lang === "nb" ? lessonSlug : `${lessonSlug}_${lang}`;
      const newLessonFileDTO: NewFileDTO = {
        filename,
        ext: ".md",
        content: rawBody,
      };
      const newLessonFileRes = await axios.post<number>(
        paths.LESSON_FILES.replace(":lessonId", lessonId.toString()),
        newLessonFileDTO
      );
    } catch (e) {
      console.error(e);
    }

    const target = ["/editor", lessonId, lessonSlug, lang].join("/");

    navigate(target);
  };

  const onChange = (e: SyntheticEvent, { name, value }: Record<string, string>) => {
    console.log(e);

    setLang(value);
  };

  return (
    <>
      <Header>Opprett ny tekstfil</Header>
      <Card
        style={{ border: "3px solid #0fbe7b", width: "16em", height: "15em", marginRight: "2em" }}
      >
        <Card.Content>
          <Card.Content>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "110px",
              }}
            >
              <Icon.Group>
                <Icon color="grey" name="file text outline" size="huge" />
              </Icon.Group>
            </div>
          </Card.Content>

          <Card.Content>
            <Divider />
          </Card.Content>
          <Card.Content extra>
            <Button
              onClick={onSubmit}
              content="Ny tekstfil "
              positive
              icon="plus"
              labelPosition="left"
            />
          </Card.Content>
        </Card.Content>
      </Card>
    </>
  );
};

export default NewLessonCard;
