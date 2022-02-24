export const oppgaveMal =
  `(TEKSTMAL FOR OPPGAVER)

# Introduksjon {.intro}

Her skriver du en introduksjon til oppgaven.

![ALTERNATIV_TEKST](./image_rT34Yx.png)


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

export const imageTemplate =
  "iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAYAAADnRuK4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTggKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUMxNUMwRkQ3OTY4MTFFOUFFQjE5QjNDOTUyMDAxMkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUMxNUMwRkU3OTY4MTFFOUFFQjE5QjNDOTUyMDAxMkQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1QzE1QzBGQjc5NjgxMUU5QUVCMTlCM0M5NTIwMDEyRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1QzE1QzBGQzc5NjgxMUU5QUVCMTlCM0M5NTIwMDEyRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhTuHVkAAFbRSURBVHja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";
