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
} from "semantic-ui-react";

const sortOptions = [
  { key: "date-modified", text: "Sist endret", value: "date-modified" },
  { key: "name", text: "Navn", value: "name" },
  { key: "date-created", text: "Dato", value: "date-created" },
  { key: "is-submitted", text: "Sendt inn", value: "is-submitted" },
];

const Overview: FC = () => {
  const { state } = useUserContext();
  const [openNewLessonModal, setOpenNewLessonModal] = useState<boolean>(false);
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
      case "date-created": {
        setUserLessons([
          ...userLessons.sort((i, j) => {
            return i.created_at < j.created_at ? 1 : -1;
          }),
        ]);

        break;
      }
      case "name": {
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
    <div>
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
                <div style={{ margin: "0", padding: "0" }} onClick={() => alert("WIP")}>
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
                            alert("WIP");
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
            {state.lessons.length > 0 ? (
              <ItemList lessons={userLessons} />
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
    </div>
  );
};
export default Overview;
