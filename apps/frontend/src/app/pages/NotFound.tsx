import { FC } from "react";
import { Link } from "react-router";
import { Container, Header, Message } from "semantic-ui-react";

/** An address the editor has no page for, with a way back instead of a bare heading. */
const NotFound: FC = () => (
  <Container style={{ marginTop: "3rem" }}>
    <Message>
      <Header as="h1" size="medium">
        Fant ikke siden
      </Header>
      <p>
        Vil du redigere en oppgave fra oppgaver.kidsakoder.no? Bruk adressen /rediger/&lt;kurs&gt;/
        &lt;oppgave&gt;, for eksempel{" "}
        <Link to="/rediger/scratch/asteroids">/rediger/scratch/asteroids</Link>.
      </p>
      <Link to="/">Til mine oppgaver</Link>
    </Message>
  </Container>
);

export default NotFound;
