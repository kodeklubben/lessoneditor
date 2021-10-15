export const oppgaveMal =
  `(TEKSTMAL FOR OPPGAVER)

# Introduksjon {.intro}

Her skriver du en introduksjon til oppgaven.

![ALTERNATIV_TEKST](BILDEFIL)


# Steg 1: Første steg {.activity}

Her beskriver du hva som er målet med dette steget.

## Sjekkliste {.check}

- [ ] tekst

- [ ] tekst

` +
  "```" +
  "\nKODEBLOKK\n" +
  "```" +
  `

- [ ] tekst

## Test prosjektet {.flag}

**Klikk på det grønne flagget.** / **Start prosjektet for å teste koden så
langt.**

- [ ] Du skal se at...

- [ ] Prøv å endre tallene i koden din. Kan du få til at...

- [ ] Forstår du hvorfor dette skjer?

## Sjekkliste {.check}

- [ ] tekst

## Test prosjektet {.flag}

**Klikk på det grønne flagget.** / **Start prosjektet for å teste koden så
langt.**

- [ ] tekst


# Steg 2: Andre steg {.activity}

I dette steget skal vi...

## Sjekkliste {.check}

- [ ] tekst

- [ ] tekst

  Du kan sette inn en kodeblokk ved å bruke` +
  "```" +
  `før og etter koden.

- [ ] tekst

## Test prosjektet {.flag}

**Klikk på det grønne flagget.** / **Start prosjektet for å teste koden så
langt.**

- [ ] Du skal se at...

- [ ] Prøv å endre tallene i koden din. Kan du få til at...

- [ ] Forstår du hvorfor dette skjer?

## Utfordring {.challenge}

Du kan prøve...

## Tips {.protip}

Et tips for å løse utfordringen er...

## Lagre spillet {.save}

Vi har laget...

Husk å lagre spillet/programmet ditt. Når du er ferdig kan du klikke på "Legg
ut"-knappen. Da vil det bli lagt ut på Scratch-hjemmesiden din slik at du enkelt
kan dele det med familien og vennene dine.`;

// Grade titles
export const GRADE = {
  preschool: "Barnehage",
  primary: "1.-4. klasse",
  secondary: "5.-7. klasse",
  junior: "8.-10. klasse",
  senior: "Videregående Skole",
};

// Subject titles
export const SUBJECT = {
  mathematics: "Matematikk",
  science: "Naturfag",
  programming: "Programmering",
  technology: "Teknologi",
  music: "Musikk",
  first_language: "Norsk",
  english: "Engelsk",
  arts_and_crafts: "Kunst og Håndverk",
  social_science: "Samfunnsfag",
};

// Topic titles
export const TOPIC = {
  animation: "Animasjon",
  app: "App",
  block_based: "Blokkbasert",
  electronics: "Elektronikk",
  cryptography: "Kryptografi",
  sound: "Lyd",
  minecraft: "Minecraft",
  web: "Nettside",
  robot: "Robot",
  game: "Spill",
  step_based: "Stegbasert",
  text_based: "Tekstbasert",
};
