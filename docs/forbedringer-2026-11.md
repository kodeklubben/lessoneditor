# Forbedringer november 2026

Grenen `forbedringer-2026-11` (fra lokal `main`, `f324dae`) retter funnene i gjennomgangen fra
2026-11-19 (S = sikkerhet, K = korrekthet, V = vedlikehold). Ingenting er pushet eller deployet.
Hver retting er en egen commit med begrunnelse; `git log f324dae..` viser dem.

## Rettet

**Sikkerhet**

| Funn | Hva |
|---|---|
| S3 | Ny Octokit per innsending; tokens blandes ikke lenger mellom samtidige brukere. |
| S4 | OAuth-scope `public_repo` i stedet for `repo`. |
| S5 | GitHub-tokenet ligger AES-256-GCM-kryptert i server-sesjonen (nøkkel avledet fra `SESSION_SECRET`), ikke i en klartekst-cookie eller minnecache. Utlogging trekker tokenet tilbake hos GitHub og sletter sesjonen. |
| S6, S7 | Video-id må matche et strengt mønster og escapes. `style` er fjernet fra tillatte attributter, og forhåndsvisningen saneres med DOMPurify (iframes bare fra YouTube-nocookie, Vimeo og MakeCode). |
| S9 | Miniatyr-JWT signeres med egen `JWT_SECRET` (kreves, må være ulik `GH_CLIENT_SECRET`). Ubrukt JwtModule fjernet. |
| S10 | Origin/Sec-Fetch-Site-sjekk på alle POST/PUT/DELETE under `/api`. |
| S11 | Slug, kurs, tittel og språk valideres ved oppretting, endring og innsending. |
| S13 | Body-grense 8 MB (var 50 MB); filer over 5 MB avvises også på serveren. |
| S14 | micro:bit-forhåndsvisningen godtar bare `postMessage` fra MakeCode. |
| S15 | Medlemslisten for en oppgave viser ikke e-post. |
| S16 | Eierskap via `lesson.created_by_id` (GitHub-id). Migrasjon `1795096346000-lesson-owner-id` fyller kolonnen. |
| S17 | `npm audit fix`, markdown-it 15.0.3, multer overstyrt til 2.5.0. Igjen: 3 moderate i prod-avhengigheter (glob/minimatch under typeorm), 30 moderate i utviklingsverktøy. |

**Korrekthet**

| Funn | Hva |
|---|---|
| K1 | Grencachen (ttl 0) er fjernet. |
| K2–K5 | Én autosave (`AutosaveController` + `useAutosave`): lagrer alltid siste tekst og front matter fra en ref, lagrer før hjem-knappen navigerer, ved utgang av editoren og med keepalive ved lukking, advarer ved ulagrede endringer. Bare én knappelayout rendres (`useMediaQuery`). Miniatyren lages separat, 10 s etter siste lagring, og feil der påvirker ikke lagringen. |
| K6 | Front matter leses og skrives med gray-matter (`libs/contracts/src/lib/frontmatter.ts`) overalt. |
| K7, K10, K11 | Innsendingen lager grenen fra upstreams standardgren (etter merge-upstream), sletter filer som er fjernet i editoren, hopper over uendrede filer (git-blob-id), og bare «A pull request already exists» gjenbruker en åpen PR. GitHub-feil blir 401/403/502 med melding. |
| K8 | Malbildet sendes når en tekst fortsatt viser det. |
| K12 | Sletting av oppgave (også delt) i én transaksjon. |
| K13 | Unike filnavn per oppgave (`bilde-2`); bildeopplastingen bruker navnet serveren valgte. |
| K16 | Innsendingsfeil vises; ingen evig spinner; lenke til PR-en. |
| K17 | Bilder i forhåndsvisningen byttes etter navn, ikke rekkefølge. |
| K18 | `/preview` og forhåndsvisningen på landingssiden bruker oppgavens kurs og språk. |
| K19 | `sam` er `se` (Nordsamisk), med alias for gamle filer og omdøping ved innsending. Alle språk i lista har mal. |

**Oversettelsen.** Klientkallet til den eksterne Cloud Run-serveren (`chatGPT.ts`) er fjernet. Nytt
endepunkt `POST /api/lesson/:id/translate` bak LoginGuard, med rategrense (10 per time per bruker,
200 per døgn, én om gangen). Front matter, navn, e-post, telefon, kode, inline-kode, `{.klasse}`,
lenkemål, URL-er, HTML og `:::`-containere byttes med plassholdere før noe sendes, og settes inn
igjen etterpå. Leverandøren er Mistral på EU-endepunktet, konfigurert med `TRANSLATION_PROVIDER`
og `MISTRAL_API_KEY`; uten dem er funksjonen av og knappen skjult. Svaret sjekkes (plassholdere,
overskrifter, listepunkter) før noe lagres. Ny fil beholder forfatterne, får brukeren som
oversetter og `machineTranslated: true`; editoren viser et varsel til noen har lest gjennom, og
PR-en lister maskinoversatte filer. Feilhåndteringen i `NewLessontextModal.tsx` er rettet.

**Tilgjengelighet og småting.** aria-label på ikonknapper, ingen `alt="test"`/`alt="thumbUrl"`,
dekorative bilder `alt=""`, `<html lang="nb">`, logo som lenke og profilmeny som knapp,
tastaturtilgang til forhåndsvisningene, synlig fokus, etiketter på tekstfeltene, `aria-live` for
lagringsstatus, `{.tip}`-knapp, inline `{.b}`-blokker tegnes, stil og knapp for `blocklightgrey`,
Lato fra `@fontsource/lato` i stedet for Google Fonts, norske tekster og «Lær Kidsa Koding.».

## Verifisert

- `npm run check` (lint, typecheck, 108 tester i 22 suiter, bygg) grønn etter hver del.
- `npm run test:smoke` mot lokal Docker-Postgres etter migrasjonen: innlogging, scope i
  OAuth-adressen, Origin-sjekk, slug-validering, unike filnavn, deling uten e-post, sletting av delt
  oppgave, at oversettelse er av (503 og skjult valg), ny tekstfil via modalen, én autosave, at
  hjem-knappen lagrer siste tekst, at alle synlige knapper har navn, at ingen forespørsler går til
  Google Fonts eller den gamle oversettelsesserveren, Scratch-blokker i linjen tegnet i Chrome,
  bilder i forhåndsvisningen og ekte PNG-miniatyr.
- Ikke testet mot ekte GitHub eller ekte Mistral (bare med falske klienter i jest).

## Gjenstår i koden

- S8: miniatyr-JWT går fortsatt i query-strengen til en offentlig Cloud Function (kortlevd, 5 min, egen hemmelighet nå). Gjør funksjonen privat (IAM) og send tokenet i en header.
- S12: `deploy.yml` bruker JSON-nøkkel, miljø i klartekst og DB-brukeren `postgres`.
- Rategrensen og sperren mot samtidige oversettelser ligger i minnet, altså per instans.
- Unike filnavn håndheves i appen, ikke med en unik indeks i databasen (gamle duplikater må ryddes først).
- K9 (delvis), K14, K15 (lesson.yml og hovedfilen kan slettes), K20–K28, V1 (ValidationPipe), V2 (Semantic UI-beta), V5 (maler i backend og frontend), V7, V8.
- Ingen i18n-løsning (react-i18next); malene finnes bare på bokmål.
- Personvernerklæring og kontosletting mangler. Et token trekkes bare tilbake ved utlogging, ikke når sesjonen utløper.
- Claude via Bedrock EU er ikke laget; bare Mistral.
- Keepalive-lagring ved lukking av fanen virker bare for tekster under 64 kB (ellers advarer nettleseren).
- Lokalt: `.env` trenger `JWT_SECRET` (lagt til i den lokale filen, ikke i git).

## Før deploy

1. Legg `JWT_SECRET`, `SESSION_SECRET` og `COOKIE_SECRET` (tilfeldige, 32 byte; `JWT_SECRET` ulik
   `GH_CLIENT_SECRET`) og variabelen `THUMB_SERVICE_URL` inn i GitHub-miljøet `production`.
2. Deploy thumbnaileren og backend sammen: tokenet går nå i `X-Preview-Token`.
3. Senere: gjør thumbnaileren privat (S8), og bytt til Workload Identity Federation, Secret Manager
   og egen databasebruker (S12).
4. Oversettelse senere: databehandleravtale med en EU-leverandør (Mistral er laget), registrer
   `TranslateModule` igjen, og legg `TRANSLATION_PROVIDER` og `MISTRAL_API_KEY` inn som secrets.
