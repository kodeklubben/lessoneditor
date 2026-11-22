# Forbedringer november 2026

Grenen `forbedringer-2026-11` (fra lokal `main`, `f324dae`) retter funnene i gjennomgangen fra
2026-11-19 (S = sikkerhet, K = korrekthet, V = vedlikehold).
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
| S17 | `npm audit` gir 0 sårbarheter, også i utviklingsverktøyene: typeorm 1.1, multer overstyrt til 2.5.0, og bare de sårbare områdene av glob (→ 14.0.6) og minimatch (→ 11.0.9) overstyrt, fordi jest 30.5 og nx 24 fortsatt krever dem. |

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

**Oversettelsen (skjult).** `TranslateModule` registreres ikke i `app.module.ts`, så endepunktene
finnes ikke og valget vises ikke. Koden og testene står igjen til det finnes en EU-leverandør med
databehandleravtale; slå den på ved å importere modulen og sette miljøvariablene under. Klientkallet til den eksterne Cloud Run-serveren (`chatGPT.ts`) er fjernet. Nytt
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

**Avhengigheter og typer (tredje runde)**

- Alle pakker på nyeste minor/patch; major: Nx 24 (ubrukte `@nx/eslint`, `@nx/jest`, `@nx/js`,
  `@nx/workspace` og lint/test-targets fjernet), typeorm 1.1, js-yaml 5, React 19.3, react-router 8.5
  (`react-router-dom` fjernet), TypeScript 6.0 uten avviklede innstillinger (ingen `baseUrl`,
  `moduleResolution` `bundler`/`node16`).
- Strict TypeScript også i backenden og i testene. Påkrevde miljøvariabler leses med `env()`
  (`apps/backend/src/app/env.ts`). Nullbare kolonner er typet `T | null`, også i `UserDTO` og
  `LessonDTO`. `npm run typecheck` sjekker nå også frontendens tester.
- Produksjonsbygget av frontenden inneholdt Reacts development-bygg: `NxAppWebpackPlugin` leser
  `NODE_ENV` fra miljøet, ikke fra `--mode`. `webpack.config.cjs` setter den nå fra `--mode`.
- Røyktesten skriver nettleserens konsollfeil og advarsler til `test-results/console.log`.

**Andre runde (resten av funnlisten)**

| Funn | Hva |
|---|---|
| S8 | Miniatyrtokenet sendes i headeren `X-Preview-Token`, ikke i query-strengen; thumbnaileren avviser `?token=`. `Authorization` står ledig for Googles ID-token, så funksjonen kan gjøres privat med IAM uten kodeendring. Backend og thumbnailer må deployes sammen. |
| K9 | Var allerede rettet: forken polles med tidsgrense (15 × 2 s), ingen fast `sleep` og ingen repoliste. |
| K14 | `updateThumbnail` lager `preview.png` når den mangler (før: TypeError og 500), godtar bare en tekst i oppgaven, og feil hos miniatyrtjenesten gir 502. |
| K15 | `lesson.yml`, `preview.png` og den siste oppgaveteksten kan ikke slettes (409 med forklaring). Regelen ligger i `libs/contracts/src/lib/files.ts` og skjuler også Slett-knappen. Slettedialogen viser serverens grunn og lukkes bare ved suksess; fillista hentes på nytt etter sletting (før satte `splice(-1)` lista til feil element). |
| K20–K28 | Brukerkonteksten henter ikke alt på nytt ved hver adresseendring, og viser spinner i stedet for at innloggingssiden blinker. Oppgavekonteksten viser feil i stedet for evig spinner, og bildene hentes parallelt. Scratch-blokker tegnes én gang per endring (før: scratchblocks på ferdig SVG ved hver rendring, språk lastet ved hvert kall). `$` i maler settes inn som tekst. PUT på en fil overskriver aldri et bilde. |
| V1 | Global `ValidationPipe` (whitelist, transform) med egne klasser i `apps/backend/src/app/request-bodies.ts`; `ParseIntPipe` på id-er; `lesson.yml` lagres bare med kjente felt og typer. DTO-ene i `libs/contracts` er fortsatt interfaces fordi frontend bruker dem. |
| V4 | Død kode fjernet: `libs/api-interfaces`, Explorer, `shared/ListFiles`, Languages, flere ubrukte hjelpere, `SessionModule`, utkommentert kode og ubrukte API-stier. `PUT /api/user/:id/lesson/:id` er fjernet: den ble kalt med en uerstattet `:lessonId` og endret sluggen uten å døpe om filene. |
| V8 | Commiten får innsenderens melding som brødtekst. |
| V9 | Backend logger med Nest Logger og bare statuskode/feiltype, aldri tokens, e-post eller innhold. |

Andre feil rettet underveis: en ny oppgave uten språk fikk `<slug>_undefined.md`; oppgave, filer og
medlemskap lages i én transaksjon; `addUser`/`updateUser` svelget feil, og innloggingen kunne lage
en ny bruker ved en databasefeil; å dele to ganger ga 500; en sesjon for en slettet bruker ga 500 på
hver side i et døgn i stedet for å logge ut.

## Verifisert

- `npm run check` (lint, typecheck, 108 tester i 22 suiter, bygg) grønn etter hver del.
- `npm run test:smoke` mot lokal Docker-Postgres etter migrasjonen: innlogging, scope i
  OAuth-adressen, Origin-sjekk, slug-validering, unike filnavn, deling uten e-post, sletting av delt
  oppgave, at oversettelse er av (503 og skjult valg), ny tekstfil via modalen, én autosave, at
  hjem-knappen lagrer siste tekst, at alle synlige knapper har navn, at ingen forespørsler går til
  Google Fonts eller den gamle oversettelsesserveren, Scratch-blokker i linjen tegnet i Chrome,
  bilder i forhåndsvisningen og ekte PNG-miniatyr.
- Ikke testet mot ekte GitHub eller ekte Mistral (bare med falske klienter i jest).
- Tredje runde: `npm run check` (129 tester), `npm audit` (0) og `npm run test:smoke` grønne etter
  hver oppgradering. `migration:generate` mot lokal Postgres viser ingen endring i kolonnene.
- Andre runde: `npm run check` (129 tester i 25 suiter) og `npm run test:smoke` grønne, også
  miniatyren gjennom den nye headeren. Smoke-testen må kjøres fra en sti uten punktum-mapper
  (`serve-static` nekter filer under f.eks. `.claude/`).

## Gjenstår i koden

- S8 (drift): tokenet går nå i en header, men funksjonen er fortsatt offentlig. Gjør den privat (IAM) og la backend sende et Google ID-token i `Authorization`.
- S12: `deploy.yml` bruker JSON-nøkkel, miljø i klartekst og DB-brukeren `postgres`.
- Miniatyrtokenet gjelder alle GET-kall for brukeren i 5 minutter, ikke bare den ene forhåndsvisningen.
- Rategrensen og sperren mot samtidige oversettelser ligger i minnet, altså per instans.
- Unike filnavn håndheves i appen, ikke med en unik indeks i databasen (gamle duplikater må ryddes først).
- Ikke oppgradert fordi verktøyene ikke støtter det ennå: Babel 8 og webpack-dev-server 6
  (`@nx/webpack` 24 krever Babel 7 og dev-server 5), TypeScript 7 (typescript-eslint <6.1, ts-jest <7).
  `@types/node` følger Node 24 som App Engine kjører.
- Semantic UI React 3 beta er ikke vedlikeholdt siden 2023; peer-kravet `react ^18` er overstyrt.
  Den gir én advarsel i utvikling (`element.ref` i `useTrigger`); ref-en virker. Varig løsning er å
  bytte UI-bibliotek (V2).
- Fremmednøkkelen `lessonLessonId` i `user_lessons_lesson` er `ON DELETE NO ACTION` i databasen,
  mens typeorm 1 forventer `CASCADE`; koden sletter koblingsradene selv. Neste `migration:generate`
  tar den med.
- V5 (maler i backend og frontend), V5 (maler i backend og frontend), V7 (`created_at`/`updated_at` er `timestamp` uten tidssone, `submitted_at` er `timestamptz`; krever en migrasjon og kjennskap til tidssonen dataene ble skrevet i).
- E-post lagres fortsatt i `user` (vises bare til brukeren selv).
- Ingen i18n-løsning (react-i18next); malene finnes bare på bokmål.
- Personvernerklæring og kontosletting mangler. Et token trekkes bare tilbake ved utlogging, ikke når sesjonen utløper.
- Claude via Bedrock EU er ikke laget; bare Mistral.
- Keepalive-lagring ved lukking av fanen virker bare for tekster under 64 kB (ellers advarer nettleseren).
- Lokalt: `.env` trenger `JWT_SECRET` (lagt til i den lokale filen, ikke i git).

## Før deploy

Se [deploy.md](deploy.md): hemmeligheter og variabler i GitHub-miljøet `production`, testversjon uten
trafikk før merge, og thumbnailer og backend sammen (tokenet går nå i `X-Preview-Token`).

Senere:
- Gjør thumbnaileren privat (S8), og bytt til Workload Identity Federation, Secret Manager og egen
  databasebruker (S12). Begge krever en eier av GCP-prosjektet.
- Oversettelse: databehandleravtale med en EU-leverandør (Mistral er laget), registrer
  `TranslateModule` igjen, og legg `TRANSLATION_PROVIDER` og `MISTRAL_API_KEY` inn som secrets.
