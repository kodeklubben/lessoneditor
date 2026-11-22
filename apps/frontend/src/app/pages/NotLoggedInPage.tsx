import React from "react";
import Navbar from "../components/navbar/Navbar";
import { Button, Container, Header, Icon } from "semantic-ui-react";
import "./NotLoggedInPage.scss";

const NotLoggedInPage: React.FC = () => {
  const handleLogin = () => {
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
