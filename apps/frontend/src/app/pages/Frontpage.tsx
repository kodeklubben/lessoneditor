import "./frontpage.scss";
import React, { FC, useEffect, useState } from "react";
import { NewLessonModal } from "../components/frontpage/NewLessonModal";
import ItemList from "../components/frontpage/ItemList";
import { useUserContext } from "../contexts/UserContext";
import { Navbar } from "../components/navbar/Navbar";
import { Button, Card, Divider, Dropdown, Header, Icon, Message, Modal } from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

const sortOptions = [
  { key: "date-modified", text: "Sist endret", value: "date-modified" },
  { key: "lesson-title", text: "Tittel", value: "lesson-title" },
  { key: "course-title", text: "Kurs", value: "course-title" },
  { key: "is-submitted", text: "Sendt inn", value: "is-submitted" },
];

export const FrontPage: FC = () => {
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
  const navigate = useNavigate();
  const navigateToEditor = (lessonId: number, lessonSlug: string, language: string) => {
    navigate({
      pathname: ["", "editor", lessonId, lessonSlug, language].join("/"),
      search: "?init",
    });
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
      <div className="frontpage">
        <section className="frontpage_section1">
          <div className="frontpage_section1__container">
            <header className="frontpage_section1__header">
              <h1>
                <span>Lær Kidsa Koding</span> <span className="subtitle">Tekstbehandler</span>
              </h1>
            </header>

            <div className="frontpage_section1__cards">
              <label>
                <h3>Lag ny oppgave</h3>
              </label>
              <div className="card_container">
                <div onClick={() => setOpenNewLessonModal(true)} className="card">
                  <Card>
                    <Card.Content className="card_content">
                      <Card.Content>
                        <Icon.Group className="card_image_height">
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
                          navigateToEditor={navigateToEditor}
                          openNewLessonModal={openNewLessonModal}
                          setOpenNewLessonModal={setOpenNewLessonModal}
                        />
                      </Card.Content>
                    </Card.Content>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="frontpage_section2">
          <div className="frontpage_section2_container">
            <div className="frontpage_section2_container__header">
              <Header as="h3">Mine oppgaver</Header>
              <Dropdown
                onChange={handleSortChange}
                inline
                options={sortOptions}
                defaultValue={sortOptions[0].value}
                value={sortValue}
              />
            </div>

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
    </>
  );
};
