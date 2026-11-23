import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Button, Container, Header, Icon } from "semantic-ui-react";
import "./NotLoggedInPage.scss";
import { rememberReturnTo } from "../utils/returnTo";

const NotLoggedInPage: React.FC = () => {
  const handleLogin = () => {
    // GitHub's sign-in ends on the front page; from there the visitor is sent back here.
    rememberReturnTo(window.location.pathname);
    window.location.href = "/api/auth/login/";
  };

  return (
    <>
      <Navbar />
      <Container className="not-logged-in-page">
        <div className="content">
          <Header as="h1">Velkommen til Lær Kidsa Koding sin tekstbehandler</Header>
          <p>For å bruke denne må du logge inn med GitHub.</p>
          <Button color="green" onClick={handleLogin}>
            <Icon name="github" aria-hidden="true" /> Logg inn med GitHub
          </Button>
        </div>
      </Container>
    </>
  );
};

export default NotLoggedInPage;
