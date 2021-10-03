import "./overview.scss";
import { FC } from "react";
import NewLessonModal from "./NewLessonModal";
import ItemList from "./ItemList";
import { useUserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { Card, Divider, Header, Icon, Message } from "semantic-ui-react";

const Overview: FC = () => {
  const { state } = useUserContext();

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
                  height: "220px",
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
            </Card.Content>
            <Card.Content extra>
              <NewLessonModal />
            </Card.Content>
          </Card.Content>
        </Card>

        <Divider style={{ height: "2px" }} section />
        {state.lessons.length > 0 ? (
          <>
            <Header as="h2">Mine oppgaver</Header>
            <ItemList lessons={state.lessons} />
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
