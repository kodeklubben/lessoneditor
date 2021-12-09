const lessonBokmal: string =
  `(TEKSTMAL FOR OPPGAVER)

# Introduksjon {.intro}

Her skriver du en introduksjon til oppgaven.

![ALTERNATIV_TEKST]("image.png")


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

const teacherBokmal: string = `(TEKSTMAL FOR LÆRERVEILEDNING)

# Om oppgaven {.activity}

I denne oppgaven...

## Oppgaven passer til: {.check}

 **Fag**: {subject}

**Anbefalte trinn**: {grade}

**Tema**: {topic}

**Tidsbruk**:

## Kompetansemål {.challenge}

- [ ] **Fag, årstrinn**:

## Forslag til læringsmål {.challenge}

- [ ] Elevene kan...

## Forslag til vurderingskriterier {.challenge}

Det er mange ulike måter man kan vurdere et programmeringsprosjekt, og her må en
selv vurdere hva som er den beste måten ut ifra hvilket fag man jobber i,
hvilken aldergruppe og hviklet nivå elevene er på, hva man ønsker å teste og
hvor mye tid man har til rådighet til å jobbe med prosjektet. I vårt
[lærerdokument](https://github.com/kodeklubben/oppgaver/wiki/Hvordan-undervise-i-og-vurdere-programmering){target=_blank} har vi blant
annet beskrevet ulike måter dette kan gjøres på, tillegg til en del andre
nyttige tips til hvordan man underviser i programmering.

## Forutsetninger og utstyr {.challenge}

- [ ] **Forutsetninger**:

- [ ] **Utstyr**:

## Fremgangsmåte

Her kommer tips, erfaring og utfordringer til de ulike stegene i den faktiske
oppgaven. 

# Steg 1:... {.activity}

- [ ] Her er det et vanlig problem at ...

# Steg 2: ... {.activity}

- [ ] Elevene må ...

**ELLER**

*Vi har dessverre ikke noen tips, erfaringer eller utfordringer tilknyttet denne
oppgaven enda.*

## Variasjoner {.challenge}

- [ ]  Elevene kan lage ...

**ELLER**

- [ ]  *Vi har dessverre ikke noen variasjoner tilknyttet denne oppgaven enda.*

## Eksterne ressurser {.challenge}

- [ ] Introduksjonsvideo om …

**ELLER**

- [ ] Foreløpig ingen eksterne ressurser ...`;

export const teacherGuideDefaultText: Record<string, string> = {
  nb: teacherBokmal,
  nn: teacherBokmal,
  en: teacherBokmal,
  is: teacherBokmal,
};

export const lessonGuideDefaultText: Record<string, string> = {
  nb: lessonBokmal,
  nn: lessonBokmal,
  en: lessonBokmal,
  is: lessonBokmal,
};
