import "./overview.scss";
import { FC } from "react";
import NewLessonModal from "./NewLessonModal";
import ItemList from "./ItemList";
import { useUserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { Card, Divider, Header, Icon, Message, Placeholder } from "semantic-ui-react";

const Overview: FC = () => {
  const { state } = useUserContext();

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

        <Header as="h2">Mine oppgaver</Header>

        {/* <Card.Group>{[1, 2, 3, 4].map((item) => cardPlaceholder(item))}</Card.Group> */}

        {state.lessons.length > 0 ? (
          <ItemList lessons={state.lessons} />
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
