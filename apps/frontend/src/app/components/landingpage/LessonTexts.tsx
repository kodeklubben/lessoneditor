import LessonCard from "./LessonCard";
import { Card, Divider, Icon, Button, Dropdown, Placeholder } from "semantic-ui-react";
import { useNavigate } from "react-router";
import { FC, SyntheticEvent, useState, useEffect } from "react";
import { LANGUAGEOPTIONS } from "../frontpage/settings/newLessonOptions";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { NewFileDTO, HeaderData } from "@lessoneditor/contracts";
import { filenameParser } from "../../utils/filename-parser";
import * as yaml from "js-yaml";
import { useLessonContext } from "../../contexts/LessonContext";
import { useUserContext } from "../../contexts/UserContext";
import { lessonGuideDefaultText } from "./settingsFiles/defaultTexts";

const cardPlaceholder = (key: number) => {
  return (
    <Card key={key}>
      <Placeholder>
        <Placeholder.Image square />
      </Placeholder>

      <Card.Content>
        <Placeholder>
          <Placeholder.Header>
            <Placeholder.Line length="very short" />
            <Placeholder.Line length="medium" />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line length="short" />
          </Placeholder.Paragraph>
        </Placeholder>
      </Card.Content>

      <Card.Content extra></Card.Content>
    </Card>
  );
};

const LessonTexts: FC<any> = ({ lessonId, fileList, lessonSlug, lessonTitle }) => {
  const [usedLanguages, setUsedLanguages] = useState<string[]>([]);
  const [unusedLanguages, setUnusedLanguages] = useState<Record<string, any>[]>([]);
  const [lang, setLang] = useState<string>("-1");

  const navigate = useNavigate();

  const { fetchFileList, setFiles, state: lessonState, loading } = useLessonContext();
  const { state } = useUserContext();

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

  const removeMD: (language: string, file: string) => Promise<number> = async (
    language: string,
    file: string
  ) => {
    const filename = language === "nb" ? file : `${file}_${language}`;
    const ext = "md";

    try {
      const files = await fetchFileList();
      const isDeleted = await axios.delete(
        paths.LESSON_FILE_DELETE.replace(":lessonId", lessonId.toString())
          .replace(":fileName", filename)
          .replace(":ext", ext)
      );
      if (isDeleted.status === 200) {
        const index = files.findIndex((item: string) => item === filename);
        const newList = files.splice(index, 1);
        setFiles(newList);
      }
      return isDeleted.status;
    } catch (e) {
      console.log(e);
      return -1;
    }
  };

  const header: HeaderData = {
    title: lessonTitle,
    author: state.user!.name || state.user!.username,
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

  const returnValue = () => {
    return usedLanguages.map((language: string, index: number) => {
      return (
        <LessonCard
          key={index}
          content={"Oppgavetekst"}
          language={language}
          lessonId={lessonId}
          lessonSlug={lessonSlug}
          lessonTitle={lessonTitle}
          removeMD={removeMD}
        />
      );
    });
  };

  return (
    <>
      <Card.Group centered>
        {!usedLanguages
          ? cardPlaceholder(-1)
          : loading
          ? usedLanguages.map((item, index) => cardPlaceholder(index))
          : returnValue()}
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
                <Card.Meta>{"Oppgavetekst"}</Card.Meta>
              </Card.Content>
              <Card.Content>
                <Divider />
              </Card.Content>
              <Card.Content extra>
                <Button onClick={onSubmit} content="Ny tekstfil " />
                {unusedLanguages.length > 0 ? (
                  <Dropdown
                    inline
                    name="language"
                    defaultValue={unusedLanguages.length > 0 ? unusedLanguages[0].value : ""}
                    onChange={onChange}
                    options={unusedLanguages}
                  />
                ) : (
                  ""
                )}
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

// const returnValue = (key: number) => {return()
//     usedLanguages.map((language: string, index: number) => {
//       return (
//         <LessonCard
//           key={index}
//           content={"Oppgavetekst"}
//           language={language}
//           lessonId={lessonId}
//           lessonSlug={lessonSlug}
//           lessonTitle={lessonTitle}
//           removeMD={removeMD}
//         />
//       );
//     });
//     {
//       lang !== "-1" ? (
//         <Card>
//           <Card.Content>
//             <Card.Content>
//               <div
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   height: "220px",
//                 }}
//               >
//                 <Icon.Group>
//                   <Icon color="grey" name="file text outline" size="massive" />
//                 </Icon.Group>
//               </div>
//             </Card.Content>
//             <Card.Content>
//               <Divider />
//             </Card.Content>
//             <Card.Content>
//               <Card.Header>{"Opprett ny tekstfil"}</Card.Header>
//               <Card.Meta>{"Oppgavetekst"}</Card.Meta>
//             </Card.Content>
//             <Card.Content>
//               <Divider />
//             </Card.Content>
//             <Card.Content extra>
//               <Button onClick={onSubmit} content="Ny tekstfil " />
//               {unusedLanguages.length > 0 ? (
//                 <Dropdown
//                   inline
//                   name="language"
//                   defaultValue={unusedLanguages.length > 0 ? unusedLanguages[0].value : ""}
//                   onChange={onChange}
//                   options={unusedLanguages}
//                 />
//               ) : (
//                 ""
//               )}
//             </Card.Content>
//           </Card.Content>
//         </Card>
//       ) : (
//         ""
//       );
//     }
//   };
