import { useState, useEffect } from "react";
import { useParams } from "react-router";
import LandingageNavbar from "./landingpageNavbar/LandingpageNavbar";
import LandingpageDatamodal from "./datapanel/LandingpageDatamodal";
import FileList from "./FileList";

import ShowSpinner from "../ShowSpinner";
import fetchMdText from "../../api/fetch-md-text";
import Navbar from "../navbar/Navbar";
import LessonData from "./datapanel/LessonData";
import MDPreview from "../editor/MDPreview";
import { Button, Container, Grid, Menu, Segment, Icon, Image, Item } from "semantic-ui-react";
import { useLessonContext } from "../../contexts/LessonContext";

const Landingpage = () => {
  const { lessonFiles, saveYmlData } = useLessonContext();

  const [activeItem, setActiveItem] = useState<string | undefined>("mainview");

  const Oversikt = () => {
    return (
      <Container style={{ marginTop: "1em" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sollicitudin, nibh non
        convallis facilisis, nibh mauris ornare urna, quis vestibulum magna dui vitae elit. Nullam
        egestas libero eu erat tincidunt, quis dapibus justo posuere. Donec eget ipsum condimentum
        nulla suscipit vestibulum sit amet tempus arcu. Etiam sit amet nibh viverra, euismod libero
        non, facilisis nibh. Quisque non leo a sapien vehicula fermentum. Donec viverra, enim cursus
        ultrices tristique, ipsum justo congue mauris, sed facilisis lectus lorem at dui. Fusce
        auctor purus et consectetur tincidunt. Morbi consequat ipsum id dui dictum, sed aliquet
        tortor hendrerit. Quisque porttitor consequat purus vel ultrices. Cras neque augue,
        vulputate nec mauris eu, egestas elementum nibh. Proin in facilisis nibh. Morbi a purus
        odio. Cras imperdiet tellus quis diam ornare, sit amet pellentesque erat consectetur. Orci
        varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Mauris
        eget risus id ex condimentum consequat et quis ligula. Etiam turpis libero, lobortis eget
        libero vitae, bibendum volutpat lacus. Sed feugiat rhoncus lacus, sed porta libero molestie
        id. Duis egestas mi enim, ultricies vehicula velit consectetur quis. Nunc quis suscipit
        nulla, nec placerat urna. Ut dolor mauris, semper ac lectus et, consequat consectetur ex.
        Quisque felis odio, ornare suscipit vehicula a, pretium et dolor. Vestibulum facilisis
        ultricies justo, laoreet euismod velit feugiat at. Sed dolor sem, maximus ac vestibulum sed,
        tristique vestibulum felis. Cras vitae turpis a lorem tincidunt pellentesque eu in turpis.
        Etiam condimentum condimentum tortor, sed elementum dui venenatis dapibus. Fusce id
        venenatis quam, quis porta diam. Fusce consectetur ut odio nec cursus. Morbi tempus urna eu
        purus varius gravida. Sed lacus erat, rhoncus vel convallis nec, pulvinar consectetur felis.
        Ut vehicula scelerisque sapien, ut pellentesque lorem auctor ut. Proin eu interdum odio,
        eget laoreet sem. Quisque eu eros neque. Phasellus nec orci magna. Sed tempor ex dui, et
        malesuada augue tincidunt a. Sed molestie ligula enim, quis lacinia ante pellentesque vitae.
        Curabitur nec nisi at nibh accumsan auctor. Mauris sollicitudin et felis non tempus. Vivamus
        non nisl facilisis, accumsan tellus vitae, mattis lacus. Cras non condimentum enim. Nulla
        vel malesuada risus. Mauris vel pharetra lacus. Nulla sit amet feugiat mi. Pellentesque
        lacinia quam at dui aliquam, quis sodales nulla tempus. Pellentesque lacinia massa ut tellus
        ornare pharetra. Vivamus egestas, libero sed facilisis fermentum, dolor lorem placerat
        augue, at porta nulla quam eu purus. Suspendisse non massa mattis, consectetur erat et,
        rhoncus dui. Donec tincidunt non eros sit amet pellentesque. Integer accumsan tristique
        gravida. Maecenas auctor libero odio, sed volutpat massa pellentesque a. Vivamus velit
        mauris, euismod vitae finibus non, eleifend sed tortor. Sed faucibus elementum purus nec
        eleifend. Maecenas vestibulum eu nulla vel congue. Proin pretium eget nulla et laoreet. Nunc
        efficitur purus porta lorem interdum, ac imperdiet nisi tempor. Ut posuere efficitur
        laoreet. Nunc eu semper libero. Etiam blandit augue non est consequat, sed ornare ex
        suscipit.
      </Container>
    );
  };

  const content = () => {
    switch (activeItem) {
      case "mainview":
        return <Oversikt />;

      case "files":
        return <FileList />;

      case "settings":
        return <LessonData />;

      default:
        return;
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: "1980px",
          margin: "auto",
          padding: "1em",
          height: "64em",
        }}
      >
        <Grid>
          <Grid.Column width={3}>
            <Menu icon="labeled" vertical>
              <Menu.Item
                name="mainview"
                active={activeItem === "mainview"}
                onClick={(e, data) => {
                  setActiveItem(data.name);
                }}
              >
                <Icon name="home" />
                Oversikt
              </Menu.Item>
              <Menu.Item
                name="files"
                active={activeItem === "files"}
                onClick={(e, data) => {
                  setActiveItem(data.name);
                }}
              >
                <Icon name="file" />
                Filer
              </Menu.Item>
              <Menu.Item
                name="settings"
                active={activeItem === "settings"}
                onClick={(e, data) => {
                  setActiveItem(data.name);
                }}
              >
                <Icon name="setting" />
                Oppgavedata
              </Menu.Item>
            </Menu>
          </Grid.Column>
          {content()}
          <Grid.Column stretched width={13}></Grid.Column>
        </Grid>
      </div>
    </>
  );
};

export default Landingpage;
