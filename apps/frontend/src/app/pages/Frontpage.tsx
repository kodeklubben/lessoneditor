import "./frontpage.scss";
import React, { FC, useEffect, useState } from "react";
import lkkLogo from "../../assets/public/lkk_logo.png";
import NewLessonModal from "../components/frontpage/NewLessonModal";
import ItemList from "../components/frontpage/ItemList";
import { LessonDTO } from "@lessoneditor/contracts";
import { useUserContext } from "../contexts/UserContext";
import Navbar from "../components/navbar/Navbar";
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

const lang_strings = { nb: {} };

const frontpage: FC = () => {
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
export default frontpage;
