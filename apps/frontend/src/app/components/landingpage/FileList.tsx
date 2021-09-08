import { useLessonContext } from "../../contexts/LessonContext";
import fetchMdText from "../../api/fetch-md-text";
import { Button, Container, Icon, Image, Item, Card, Modal } from "semantic-ui-react";
import { useState, useEffect } from "react";
import MDPreview from "../editor/MDPreview";
import { filenameParser } from "../../utils/filename-parser";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";

const FileList = () => {
  const history = useHistory();
  const { lessonId } = useParams<{ lessonId: string }>();
  const { lessonFiles, lessonData } = useLessonContext();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [mdTexts, setMdTexts] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchMd() {
      lessonFiles
        .filter((item) => item.filename.slice(-3) === ".md")
        .forEach(async (item) => {
          const file = item.filename.slice(0, item.filename.length - 3);
          const { language } = filenameParser(file);
          const result = await fetchMdText(lessonId, file);
          const separator = "---\n";
          const [_, __, body] = result.split(separator);
          setMdTexts((prevState) => ({ ...prevState, [language]: body }));
        });
    }
    fetchMd();
  }, []);

  const filteredLessonFiles = lessonFiles.filter(
    (items) =>
      items.filename !== "data.json" &&
      items.filename !== "lesson.yml" &&
      items.filename !== "preview.png"
  );

  const navigateToEditor = (filename: string) => {
    const target = ["/editor", lessonId, filename].join("/");
    history.push(target);
  };

  const [imageUrl] = lessonFiles.filter((items) => items.filename === "preview.png");

  return (
    <>
      <Container style={{ marginTop: "1em" }}>
        <Card.Group divided>
          {filteredLessonFiles.map((item) => {
            const mdFile = item.filename.slice(0, item.filename.length - 3);
            const { language } = filenameParser(mdFile);

            return (
              <Card key={item.filename}>
                {item.filename.slice(-3) === ".md" ? (
                  <Image src={`${imageUrl.url}?${performance.now()}`} />
                ) : (
                  ""
                )}
                <Card.Content>
                  <Card.Description>{item.filename}</Card.Description>
                  <Card.Meta>{`${Math.round(item.size / 1000)} kb`}</Card.Meta>
                  <div style={{ marginTop: "3em" }} />
                  <Button.Group>
                    {item.filename.slice(-3) === ".md" ? (
                      <>
                        <Button
                          onClick={() => {
                            navigateToEditor(item.filename.slice(0, item.filename.length - 3));
                          }}
                          color="green"
                          icon
                          labelPosition="left"
                        >
                          {" Redigere "}
                          <Icon name="pencil" />
                        </Button>
                        <Modal
                          onClose={() => setOpen({ [mdFile]: false })}
                          onOpen={() => setOpen({ [mdFile]: true })}
                          open={open[mdFile]}
                          dimmer="inverted"
                          trigger={
                            <Button color="black" icon labelPosition="left">
                              {"Åpne "}
                              <Icon name="folder open" />
                            </Button>
                          }
                        >
                          <MDPreview
                            mdText={mdTexts[language]}
                            course={lessonData.course}
                            language={language}
                          />
                        </Modal>
                      </>
                    ) : (
                      ""
                    )}
                  </Button.Group>
                  <Button style={{ background: "none" }} icon floated="right">
                    <Icon name="delete" />
                    Slett
                  </Button>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      </Container>
    </>
  );
};

export default FileList;
