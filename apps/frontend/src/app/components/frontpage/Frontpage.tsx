import "./frontpage.scss";
import { useContext } from "react";
import NewLessonModal from "./NewLessonModal";
import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { useHistory } from "react-router-dom";
import { Divider, Header, Message } from "semantic-ui-react";

const Overview = () => {
  const history = useHistory();
    const { lessons, removeLesson }= useContext<any>(UserContext);

  const navigateToHome = (lessonId: any) => {
    const target = ["/landingpage", lessonId, "lessontexts"].join("/");
    history.push(target);
  };

  return (
    <div>
      <Navbar />
      <div className="overViewContainer">
        <NewLessonModal />
        <Divider style={{ height: "2px" }} section />
        {lessons.length > 0 ? (
          <>
            <Header as="h2">Mine oppgaver</Header>
            <ItemList
              items={lessons}
              removeLesson={removeLesson}
              navigateToHome={navigateToHome}
            />
          </>
        ) : (
          <Message>
            <Message.Header>Du har ingen kurs</Message.Header>
            <Message.Content>
              Opprett en ny oppgave ved å trykke på knappen "Ny oppgave"
            </Message.Content>
          </Message>
        )}
        <br />
      </div>
    </div>
  );
};
export default Overview;
