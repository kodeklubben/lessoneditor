import "./frontpage.scss";
import NewLessonModal from "./NewLessonModal";
import ItemList from "./ItemList";
import { useUserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { useHistory } from "react-router-dom";
import { Card, Divider, Header, Icon, Message } from "semantic-ui-react";

const Overview = () => {
  const history = useHistory();
  const { lessons, removeLesson } = useUserContext();

  const navigateToHome = (lessonId: any) => {
    const target = ["/landingpage", lessonId, "lessontexts"].join("/");
    history.push(target);
  };

  return (
    <div>
      <Navbar />
      <div className="overViewContainer">
        <Card>
          <Card.Content>
            <Card.Content>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "220px"
                }}
              >
                <Icon.Group>
                  <Icon color="grey" name="file text outline" size="massive" />
                </Icon.Group>
              </div>
            </Card.Content>
            <Card.Content>
              <Card.Header>
                <Divider />
              </Card.Header>
              <Card.Meta></Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <NewLessonModal />
            </Card.Content>
          </Card.Content>
        </Card>

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
