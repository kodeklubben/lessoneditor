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
    <>
      <Navbar />
      <div className="overViewContainer">
        <section className="overviewSection1">
          <div className="overviewSection_content">
            <Header as="h3" style={{ marginBottom: "1em" }}>
              Ny Oppgave
            </Header>
            <Card style={{ border: "3px solid #0fbe7b", width: "16em", height: "15em" }}>
              <Card.Content>
                <Card.Content>
                  <div
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
          </div>
        </section>
        <section className="overviewSection2">
          <div className="overviewSection_content">
            <Header as="h3" style={{ marginBottom: "2em" }}>
              Mine Oppgaver
            </Header>
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
        </section>
      </div>
    </>
  );
};
export default Overview;
