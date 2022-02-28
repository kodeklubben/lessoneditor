import "./overview.scss";
import React, { FC, useEffect, useState } from "react";
import lkkLogo from "../../../assets/public/lkk_logo.png";
import NewLessonModal from "./NewLessonModal";
import ItemList from "./ItemList";
import { LessonDTO } from "@lessoneditor/contracts";
import { useUserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import {
  Button,
  Card,
  Divider,
  Header,
  Icon,
  Message,
  Placeholder,
  Image,
  Dropdown,
  Modal,
} from "semantic-ui-react";

const sortOptions = [
  { key: "date-modified", text: "Sist endret", value: "date-modified" },
  { key: "lesson-title", text: "Tittel", value: "lesson-title" },
  { key: "course-title", text: "Kurs", value: "course-title" },
  { key: "is-submitted", text: "Sendt inn", value: "is-submitted" },
];

const Overview: FC = () => {
  const { state } = useUserContext();
  const [openNewLessonModal, setOpenNewLessonModal] = useState<boolean>(false);
  const [openLessonModal, setOpenLessonModal] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>("date-modified");

  const [userLessons, setUserLessons] = useState(
    state.lessons.sort((i, j) => {
      return i.updated_at < j.updated_at ? 1 : -1;
    })
  );

  useEffect(() => {
    setUserLessons(
      state.lessons.sort((i, j) => {
        return i.updated_at < j.updated_at ? 1 : -1;
      })
    );
  }, [state.lessons]);

  const handleSortChange = (e: any, { value }: any) => {
    setSortValue(value);
    switch (value) {
      case "date-modified": {
        setUserLessons([
          ...userLessons.sort((i, j) => {
            return i.updated_at < j.updated_at ? 1 : -1;
          }),
        ]);

        break;
      }
      case "course-title": {
        setUserLessons([
          ...userLessons.sort((i, j) => {
            return i.courseTitle.toLowerCase().localeCompare(j.courseTitle.toLowerCase());
          }),
        ]);

        break;
      }
      case "lesson-title": {
        setUserLessons([
          ...userLessons.sort((i, j) => {
            return i.lessonTitle.toLowerCase().localeCompare(j.lessonTitle.toLowerCase());
          }),
        ]);

        break;
      }
      case "is-submitted": {
        setUserLessons([
          ...userLessons.sort((i, j) => {
            return i.submitted ? -1 : 1;
          }),
        ]);

        break;
      }
      default:
        break;
    }
  };

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

  return (
    <>
      {openLessonModal && (
        <Modal
          onClose={() => setOpenLessonModal(false)}
          onOpen={() => setOpenLessonModal(true)}
          open={openLessonModal}
          trigger={<Button>Show Modal</Button>}
          dimmer="inverted"
        >
          <Modal.Header>{"Her kommer en meny for å åpne eksisterende oppgave"}</Modal.Header>
          <Modal.Content>
            <h3>WorkInProgress</h3>
          </Modal.Content>

          <Button
            onClick={() => setOpenLessonModal(false)}
            style={{ position: "absolute", background: "none", top: "0", right: "0" }}
            icon
          >
            <Icon size="huge" name="x" />
          </Button>
        </Modal>
      )}
      <Navbar />
      <div className="overViewContainer">
        <section className="overviewSection1">
          <div className="overviewSection1_content">
            <Header as={"h1"}>Lær Kidsa Kodings Tekstbehandler</Header>
            <div
              style={{
                borderBottom: "5px solid",
                borderBottomColor: "green",
                margin: "0 0 6vh 0vh",
                width: "50%",
              }}
            />
            <div
              style={{
                display: "flex",
                flexFlow: "row nowrap",
                justifyContent: "start",
                alignItems: "center",
                overflowX: "auto",
              }}
            >
              <div style={{ margin: "0 3vw 2vh 0" }}>
                <Header as="h3" style={{ marginBottom: "1em" }}>
                  Lag ny oppgave
                </Header>
                <div
                  style={{ margin: "0", padding: "0" }}
                  onClick={() => setOpenNewLessonModal(true)}
                >
                  <Card
                    className="overview_Button"
                    style={{
                      width: "16em",
                      height: "15em",
                      padding: "0",
                    }}
                  >
                    <Card.Content>
                      <Card.Content
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          margin: "2.4em",
                        }}
                      >
                        <Icon.Group>
                          <Icon color="grey" name="file text outline" size="huge" />
                        </Icon.Group>
                      </Card.Content>

                      <Card.Content>
                        <Card.Header>
                          <Divider />
                        </Card.Header>
                      </Card.Content>
                      <Card.Content extra>
                        <NewLessonModal
                          openNewLessonModal={openNewLessonModal}
                          setOpenNewLessonModal={setOpenNewLessonModal}
                        />
                      </Card.Content>
                    </Card.Content>
                  </Card>
                </div>
              </div>
              <div style={{ margin: "0 1vw 2vh 0" }}>
                <h3 style={{ marginBottom: "1em", minWidth: "14em" }}>
                  Lær Kidsa Kodings oppgavesamling
                </h3>
                <div style={{ margin: "0", padding: "0" }} onClick={() => setOpenLessonModal(true)}>
                  <Card className="overview_Button" style={{ width: "16em", height: "15em" }}>
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
                          <Image.Group>
                            <Image
                              src={lkkLogo}
                              style={{ height: "90px", marginBottom: "-1.5vh" }}
                            />
                          </Image.Group>
                        </div>
                      </Card.Content>

                      <Card.Content>
                        <Card.Header>
                          <Divider />
                        </Card.Header>
                      </Card.Content>
                      <Card.Content extra>
                        <Button
                          icon="folder open"
                          labelPosition="left"
                          positive
                          content="Åpne"
                          onClick={() => {
                            setOpenLessonModal(true);
                          }}
                        />
                      </Card.Content>
                    </Card.Content>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="overviewSection2">
          <div className="overviewSection2_content">
            <div className="overviewSection2_header">
              <Header as="h3" style={{ marginBottom: "2em" }}>
                Mine oppgaver
              </Header>
              <Dropdown
                onChange={handleSortChange}
                inline
                options={sortOptions}
                defaultValue={sortOptions[0].value}
                value={sortValue}
              />
            </div>

            {state.lessons.length > 0 ? (
              <div>
                <ItemList lessons={userLessons} />
              </div>
            ) : (
              <Message compact>
                <Message.Header>Du har ingen kurs</Message.Header>
                <p>Opprett en ny oppgave ved å trykke på knappen "Ny oppgave"</p>
              </Message>
            )}
            <br />
          </div>
        </section>
      </div>
    </>
  );
};
export default Overview;
