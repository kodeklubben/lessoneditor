import "./frontpage.scss";
import React, { FC, useEffect, useState } from "react";
import NewLessonModal from "../components/frontpage/NewLessonModal";
import ItemList from "../components/frontpage/ItemList";
import { useUserContext } from "../contexts/UserContext";
import Navbar from "../components/navbar/Navbar";
import { Card, Divider, Header, Icon, Message, Dropdown } from "semantic-ui-react";
import { LessonDTO } from "@lessoneditor/contracts";

const sortOptions = [
  { key: "date-modified", text: "Sist endret", value: "date-modified" },
  { key: "lesson-title", text: "Tittel", value: "lesson-title" },
  { key: "course-title", text: "Kurs", value: "course-title" },
  { key: "is-submitted", text: "Sendt inn", value: "is-submitted" },
];

const sortLessons = (lessons: LessonDTO[], key: string) => {
  const sortedLessons = [...lessons];
  switch (key) {
    case "date-modified":
      return sortedLessons.sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
    case "lesson-title":
      return sortedLessons.sort((a, b) => a.lessonTitle.localeCompare(b.lessonTitle));
    case "course-title":
      return sortedLessons.sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
    case "is-submitted":
      return sortedLessons.sort((a, b) => (a.submitted === b.submitted ? 0 : a.submitted ? -1 : 1));
    default:
      return lessons;
  }
};

const frontpage: FC = () => {
  const { state } = useUserContext();
  const [openNewLessonModal, setOpenNewLessonModal] = useState<boolean>(false);
  const [sortValue, setSortValue] = useState<string>("date-modified");
  const [userLessons, setUserLessons] = useState<LessonDTO[]>(
    sortLessons(state.lessons, sortValue)
  );

  useEffect(() => {
    setUserLessons(sortLessons(state.lessons, sortValue));
  }, [state.lessons, sortValue]);

  function openModal() {
    if (!openNewLessonModal) setOpenNewLessonModal(true);
  }

  const handleSortChange = (e: any, { value }: any) => {
    setSortValue(value);
  };

  return (
    <>
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
                <div onClick={openModal} className="card">
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
                // defaultValue={sortOptions[0].value}
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
