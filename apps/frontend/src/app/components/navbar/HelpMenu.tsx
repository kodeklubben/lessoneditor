import { FC } from "react";
import { Icon, List, Popup } from "semantic-ui-react";

const WIKI = "https://github.com/kodeklubben/oppgaver/wiki";

/** The lesson repo's own guides for writing lessons (#334); the editor has no wiki of its own. */
const GUIDES = [
  { page: "Den-gode-oppgaven", title: "Den gode oppgaven", about: "Hva som gjør en oppgave god" },
  {
    page: "Stilguide-for-kode-og-tekst",
    title: "Stilguide for kode og tekst",
    about: "Skrivemåte, kodeeksempler og bilder",
  },
  {
    page: "Hvordan-skrive-en-lærerveiledning",
    title: "Hvordan skrive en lærerveiledning",
    about: "Hva lærerveiledningen skal inneholde",
  },
  {
    page: "Oppgaver-på-andre-språk",
    title: "Oppgaver på andre språk",
    about: "Oversette en oppgave",
  },
];

const HelpMenu: FC = () => (
  <Popup
    on="click"
    position="bottom right"
    wide
    header="Hjelp til å skrive oppgaver"
    content={
      <List relaxed>
        {GUIDES.map(({ page, title, about }) => (
          <List.Item key={page}>
            <List.Content>
              <List.Header
                as="a"
                href={`${WIKI}/${page}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {title}
              </List.Header>
              <List.Description>{about}</List.Description>
            </List.Content>
          </List.Item>
        ))}
        <List.Item>
          <a href={WIKI} target="_blank" rel="noopener noreferrer">
            Alt i wikien til Lær Kidsa Koding
          </a>
        </List.Item>
      </List>
    }
    trigger={
      <button type="button" className="navbar_help_button" aria-label="Hjelp">
        <Icon name="question circle outline" size="large" aria-hidden="true" />
        <span className="navbar_help_label">Hjelp</span>
      </button>
    }
  />
);

export default HelpMenu;
