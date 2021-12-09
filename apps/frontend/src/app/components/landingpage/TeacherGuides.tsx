import { FC, SyntheticEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Card, Button, Icon, Divider, Dropdown } from "semantic-ui-react";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import LessonCard from "./LessonCard";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { NewFileDTO, HeaderData } from "@lessoneditor/contracts";
import { filenameParser } from "../../utils/filename-parser";
import * as yaml from "js-yaml";
import { useLessonContext } from "../../contexts/LessonContext";
import { useUserContext } from "../../contexts/UserContext";

import insertMetaDataInTeacherGuide from "./utils/insertMetaDataInTeacherGuide";

const TeacherGuides: FC<any> = ({ lessonId, fileList, lessonSlug, lessonTitle }) => {
  const [usedLanguages, setUsedLanguages] = useState<string[]>([]);
  const [unusedLanguages, setUnusedLanguages] = useState<Record<string, any>[]>([]);
  const [lang, setLang] = useState<string>("-1");

  const navigate = useNavigate();

  const { fetchFileList, yml } = useLessonContext();
  const { state } = useUserContext();

  useEffect(() => {
    const fetchData = async () => {
      const fileList = await fetchFileList();
      const tempUsedLang: string[] = [];
      const tempUnusedLang: Record<string, string>[] = [...LANGUAGEOPTIONS];
      fileList.forEach((filename: string) => {
        const { isMarkdown, isReadme, language } = filenameParser(filename);

        if (isReadme && language.length > 0) {
          setUsedLanguages((prevLang) => [...prevLang, language]);
        }
      });
      setUsedLanguages(tempUsedLang);
      setUnusedLanguages(tempUnusedLang);
      tempUnusedLang.length > 0 ? setLang(tempUnusedLang[0].value) : setLang("-1");
    };

    fetchData();
  }, []);

  const header: HeaderData = {
    title: lessonTitle,
    author: state.user!.name,
    authorList: [],
    language: lang,
    translator: "",
    translatorList: [],
  };

  const onSubmit = async () => {
    try {
      const lessonText = insertMetaDataInTeacherGuide(yml, lang);
      const rawBody = "---\n" + yaml.dump(header) + "---\n" + lessonText;

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
        {lang !== "-1" ? (
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
                  defaultValue={unusedLanguages.length > 0 ? unusedLanguages[0].value : ""}
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

export default TeacherGuides;
