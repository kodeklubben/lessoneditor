/*
 * The texts a new lesson and a new teacher guide start from, per language. Bokmål is the original;
 * nynorsk, English, Icelandic, French and Ukrainian are translations that use the words the lessons
 * in kodeklubben/oppgaver use in those languages (Sjekkliste, Skref, Крок …). Northern Sami (se)
 * has no translation and starts from bokmål: it needs someone who writes the language.
 */

const F = "```";

const nbLesson = `**Tekstmal for nye oppgaver**

Du kan trygt redigere denne teksten.

# Introduksjon {.intro}

Her skriver du en introduksjon til oppgaven.

![ALTERNATIV_TEKST](./image_rT34Yx.png)


# Steg 1: Første steg {.activity}

Her beskriver du hva som er målet med dette steget.

## Sjekkliste {.check}

- [ ] tekst

- [ ] tekst

${F}
KODEBLOKK
${F}

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

  Du kan sette inn en kodeblokk ved å skrive \`\` ${F} \`\` på en egen linje før
  og etter koden.

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

const nnLesson = `**Tekstmal for nye oppgåver**

Du kan trygt redigere denne teksten.

# Introduksjon {.intro}

Her skriv du ei innleiing til oppgåva.

![ALTERNATIV_TEKST](./image_rT34Yx.png)


# Steg 1: Første steg {.activity}

Her skildrar du kva som er målet med dette steget.

## Sjekkliste {.check}

- [ ] tekst

- [ ] tekst

${F}
KODEBLOKK
${F}

- [ ] tekst

## Test prosjektet {.flag}

**Klikk på det grøne flagget.** / **Start prosjektet for å teste koden så
langt.**

- [ ] Du skal sjå at...

- [ ] Prøv å endre tala i koden din. Kan du få til at...

- [ ] Forstår du kvifor dette skjer?

## Sjekkliste {.check}

- [ ] tekst

## Test prosjektet {.flag}

**Klikk på det grøne flagget.** / **Start prosjektet for å teste koden så
langt.**

- [ ] tekst


# Steg 2: Andre steg {.activity}

I dette steget skal vi...

## Sjekkliste {.check}

- [ ] tekst

- [ ] tekst

  Du kan setje inn ein kodeblokk ved å skrive \`\` ${F} \`\` på ei eiga linje før
  og etter koden.

- [ ] tekst

## Test prosjektet {.flag}

**Klikk på det grøne flagget.** / **Start prosjektet for å teste koden så
langt.**

- [ ] Du skal sjå at...

- [ ] Prøv å endre tala i koden din. Kan du få til at...

- [ ] Forstår du kvifor dette skjer?

## Utfordring {.challenge}

Du kan prøve...

## Tips {.protip}

Eit tips for å løyse utfordringa er...

## Lagre spelet {.save}

Vi har laga...

Hugs å lagre spelet/programmet ditt. Når du er ferdig, kan du klikke på «Legg
ut»-knappen. Då blir det lagt ut på Scratch-heimesida di, slik at du enkelt kan
dele det med familien og venene dine.`;

const enLesson = `**Template for new lessons**

You can safely edit this text.

# Introduction {.intro}

Write an introduction to the lesson here.

![ALT_TEXT](./image_rT34Yx.png)


# Step 1: First step {.activity}

Describe the goal of this step here.

## Checklist {.check}

- [ ] text

- [ ] text

${F}
CODE BLOCK
${F}

- [ ] text

## Test the project {.flag}

**Click the green flag.** / **Run the project to test the code so far.**

- [ ] You should see that...

- [ ] Try changing the numbers in your code. Can you make...

- [ ] Do you understand why this happens?

## Checklist {.check}

- [ ] text

## Test the project {.flag}

**Click the green flag.** / **Run the project to test the code so far.**

- [ ] text


# Step 2: Second step {.activity}

In this step we will...

## Checklist {.check}

- [ ] text

- [ ] text

  You can add a code block by writing \`\` ${F} \`\` on a line of its own before
  and after the code.

- [ ] text

## Test the project {.flag}

**Click the green flag.** / **Run the project to test the code so far.**

- [ ] You should see that...

- [ ] Try changing the numbers in your code. Can you make...

- [ ] Do you understand why this happens?

## Challenge {.challenge}

You can try...

## Tip {.protip}

A tip for solving the challenge is...

## Save the game {.save}

We have made...

Remember to save your game/program. When you are done, you can click the "Share"
button. It will then be shared on your Scratch page, so you can easily show it to
your family and friends.`;

const isLesson = `**Sniðmát fyrir ný verkefni**

Þú getur breytt þessum texta að vild.

# Kynning {.intro}

Hér skrifar þú kynningu á verkefninu.

![LÝSING_Á_MYND](./image_rT34Yx.png)


# Skref 1: Fyrsta skref {.activity}

Hér lýsir þú markmiðinu með þessu skrefi.

## Gátlisti {.check}

- [ ] texti

- [ ] texti

${F}
KÓÐABLOKK
${F}

- [ ] texti

## Prófaðu verkefnið {.flag}

**Smelltu á græna fánann.** / **Keyrðu verkefnið til að prófa kóðann hingað
til.**

- [ ] Þú ættir að sjá að...

- [ ] Prófaðu að breyta tölunum í kóðanum. Geturðu látið...

- [ ] Skilurðu af hverju þetta gerist?

## Gátlisti {.check}

- [ ] texti

## Prófaðu verkefnið {.flag}

**Smelltu á græna fánann.** / **Keyrðu verkefnið til að prófa kóðann hingað
til.**

- [ ] texti


# Skref 2: Annað skref {.activity}

Í þessu skrefi ætlum við að...

## Gátlisti {.check}

- [ ] texti

- [ ] texti

  Þú getur sett inn kóðablokk með því að skrifa \`\` ${F} \`\` í sérstaka línu á
  undan og á eftir kóðanum.

- [ ] texti

## Prófaðu verkefnið {.flag}

**Smelltu á græna fánann.** / **Keyrðu verkefnið til að prófa kóðann hingað
til.**

- [ ] Þú ættir að sjá að...

- [ ] Prófaðu að breyta tölunum í kóðanum. Geturðu látið...

- [ ] Skilurðu af hverju þetta gerist?

## Áskorun {.challenge}

Þú getur prófað að...

## Ábending {.protip}

Ábending til að leysa áskorunina er...

## Vistaðu leikinn {.save}

Við höfum búið til...

Mundu að vista leikinn/forritið þitt. Þegar þú ert búin(n) getur þú smellt á
„Deila“-hnappinn. Þá birtist hann á Scratch-síðunni þinni svo að þú getur
auðveldlega sýnt hann fjölskyldu og vinum.`;

const frLesson = `**Modèle pour les nouvelles activités**

Vous pouvez modifier ce texte librement.

# Introduction {.intro}

Écrivez ici une introduction à l'activité.

![TEXTE_ALTERNATIF](./image_rT34Yx.png)


# Étape 1 : Première étape {.activity}

Décrivez ici l'objectif de cette étape.

## Liste de contrôle {.check}

- [ ] texte

- [ ] texte

${F}
BLOC DE CODE
${F}

- [ ] texte

## Teste ton projet {.flag}

**Clique sur le drapeau vert.** / **Lance le projet pour tester le code écrit
jusqu'ici.**

- [ ] Tu devrais voir que...

- [ ] Essaie de changer les nombres dans ton code. Arrives-tu à faire en sorte
  que...

- [ ] Comprends-tu pourquoi cela se produit ?

## Liste de contrôle {.check}

- [ ] texte

## Teste ton projet {.flag}

**Clique sur le drapeau vert.** / **Lance le projet pour tester le code écrit
jusqu'ici.**

- [ ] texte


# Étape 2 : Deuxième étape {.activity}

Dans cette étape, nous allons...

## Liste de contrôle {.check}

- [ ] texte

- [ ] texte

  Vous pouvez insérer un bloc de code en écrivant \`\` ${F} \`\` sur une ligne à
  part avant et après le code.

- [ ] texte

## Teste ton projet {.flag}

**Clique sur le drapeau vert.** / **Lance le projet pour tester le code écrit
jusqu'ici.**

- [ ] Tu devrais voir que...

- [ ] Essaie de changer les nombres dans ton code. Arrives-tu à faire en sorte
  que...

- [ ] Comprends-tu pourquoi cela se produit ?

## Défi {.challenge}

Tu peux essayer de...

## Astuce {.protip}

Une astuce pour relever le défi :...

## Enregistre ton jeu {.save}

Nous avons créé...

N'oublie pas d'enregistrer ton jeu/programme. Quand tu as fini, tu peux cliquer
sur le bouton « Partager ». Il sera alors publié sur ta page Scratch, pour que tu
puisses facilement le montrer à ta famille et à tes amis.`;

const uaLesson = `**Шаблон для нових завдань**

Цей текст можна сміливо редагувати.

# Вступ {.intro}

Тут напишіть вступ до завдання.

![ОПИС_ЗОБРАЖЕННЯ](./image_rT34Yx.png)


# Крок 1: Перший крок {.activity}

Тут опишіть мету цього кроку.

## План перевірки {.check}

- [ ] текст

- [ ] текст

${F}
БЛОК КОДУ
${F}

- [ ] текст

## Тестуйте проєкт {.flag}

**Натисніть на зелений прапорець.** / **Запустіть проєкт, щоб перевірити код,
який ви вже написали.**

- [ ] Ви маєте побачити, що...

- [ ] Спробуйте змінити числа у своєму коді. Чи вдасться вам зробити так, щоб...

- [ ] Чи розумієте ви, чому так відбувається?

## План перевірки {.check}

- [ ] текст

## Тестуйте проєкт {.flag}

**Натисніть на зелений прапорець.** / **Запустіть проєкт, щоб перевірити код,
який ви вже написали.**

- [ ] текст


# Крок 2: Другий крок {.activity}

На цьому кроці ми...

## План перевірки {.check}

- [ ] текст

- [ ] текст

  Блок коду можна вставити, написавши \`\` ${F} \`\` в окремому рядку перед кодом
  і після нього.

- [ ] текст

## Тестуйте проєкт {.flag}

**Натисніть на зелений прапорець.** / **Запустіть проєкт, щоб перевірити код,
який ви вже написали.**

- [ ] Ви маєте побачити, що...

- [ ] Спробуйте змінити числа у своєму коді. Чи вдасться вам зробити так, щоб...

- [ ] Чи розумієте ви, чому так відбувається?

## Виклик {.challenge}

Можете спробувати...

## Порада {.protip}

Порада, як упоратися з викликом: ...

## Зберегти гру {.save}

Ми створили...

Не забудьте зберегти гру/програму. Коли закінчите, натисніть кнопку
«Поділитися». Тоді її буде опубліковано на вашій сторінці Scratch, і ви зможете
легко показати її родині та друзям.`;

const nbTeacher = `**Tekstmal for ny lærerveiledning**

Du kan trygt redigere denne teksten.

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
hvilken aldersgruppe og hvilket nivå elevene er på, hva man ønsker å teste og
hvor mye tid man har til rådighet til å jobbe med prosjektet. I vårt
[lærerdokument](https://github.com/kodeklubben/oppgaver/wiki/Hvordan-undervise-i-og-vurdere-programmering){target=_blank} har vi blant
annet beskrevet ulike måter dette kan gjøres på, i tillegg til en del andre
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

const TEACHER_DOC =
  "https://github.com/kodeklubben/oppgaver/wiki/Hvordan-undervise-i-og-vurdere-programmering";

const nnTeacher = `**Tekstmal for ny lærarrettleiing**

Du kan trygt redigere denne teksten.

# Om oppgåva {.activity}

I denne oppgåva...

## Oppgåva passar til: {.check}

**Fag**: {subject}

**Anbefalte trinn**: {grade}

**Tema**: {topic}

**Tidsbruk**:

## Kompetansemål {.challenge}

- [ ] **Fag, årstrinn**:

## Forslag til læringsmål {.challenge}

- [ ] Elevane kan...

## Forslag til vurderingskriterium {.challenge}

Det er mange ulike måtar å vurdere eit programmeringsprosjekt på, og her må ein
sjølv vurdere kva som er den beste måten ut frå kva fag ein jobbar i, kva
aldersgruppe og kva nivå elevane er på, kva ein ønskjer å teste og kor mykje tid
ein har til rådvelde til å jobbe med prosjektet. I
[lærardokumentet vårt](${TEACHER_DOC}){target=_blank} har vi
mellom anna skildra ulike måtar dette kan gjerast på, i tillegg til fleire andre
nyttige tips om korleis ein underviser i programmering.

## Føresetnader og utstyr {.challenge}

- [ ] **Føresetnader**:

- [ ] **Utstyr**:

## Framgangsmåte

Her kjem tips, erfaringar og utfordringar til dei ulike stega i sjølve oppgåva.

# Steg 1:... {.activity}

- [ ] Her er det eit vanleg problem at ...

# Steg 2: ... {.activity}

- [ ] Elevane må ...

**ELLER**

*Vi har dessverre ikkje nokon tips, erfaringar eller utfordringar knytte til
denne oppgåva enno.*

## Variasjonar {.challenge}

- [ ]  Elevane kan lage ...

**ELLER**

- [ ]  *Vi har dessverre ikkje nokon variasjonar knytte til denne oppgåva enno.*

## Eksterne ressursar {.challenge}

- [ ] Introduksjonsvideo om …

**ELLER**

- [ ] Førebels ingen eksterne ressursar ...`;

const enTeacher = `**Template for a new teacher guide**

You can safely edit this text.

# About the lesson {.activity}

In this lesson...

## The lesson is suitable for: {.check}

**Subject**: {subject}

**Recommended grades**: {grade}

**Topic**: {topic}

**Time needed**:

## Curriculum goals {.challenge}

- [ ] **Subject, grade**:

## Suggested learning goals {.challenge}

- [ ] The pupils can...

## Suggested assessment criteria {.challenge}

There are many ways to assess a programming project. Choose the one that suits
the subject, the age and level of the pupils, what you want to assess and how
much time you have for the project. Our
[teacher document](${TEACHER_DOC}){target=_blank} (in Norwegian)
describes several ways to do this, along with other useful tips on teaching
programming.

## Prerequisites and equipment {.challenge}

- [ ] **Prerequisites**:

- [ ] **Equipment**:

## How to run the lesson

Tips, experiences and challenges for each step of the lesson.

# Step 1:... {.activity}

- [ ] A common problem here is that ...

# Step 2: ... {.activity}

- [ ] The pupils need to ...

**OR**

*Unfortunately, we do not have any tips, experiences or challenges for this
lesson yet.*

## Variations {.challenge}

- [ ]  The pupils can make ...

**OR**

- [ ]  *Unfortunately, we do not have any variations for this lesson yet.*

## External resources {.challenge}

- [ ] An introduction video about …

**OR**

- [ ] No external resources yet ...`;

const isTeacher = `**Sniðmát fyrir nýjar kennsluleiðbeiningar**

Þú getur breytt þessum texta að vild.

# Um verkefnið {.activity}

Í þessu verkefni...

## Verkefnið hentar fyrir: {.check}

**Námsgrein**: {subject}

**Ráðlagðir árgangar**: {grade}

**Efni**: {topic}

**Tímalengd**:

## Hæfniviðmið {.challenge}

- [ ] **Námsgrein, árgangur**:

## Tillögur að námsmarkmiðum {.challenge}

- [ ] Nemendur geta...

## Tillögur að matsviðmiðum {.challenge}

Það eru margar leiðir til að meta forritunarverkefni. Veldu þá sem hentar best
námsgreininni, aldri og getu nemendanna, því sem þú vilt meta og þeim tíma sem
þú hefur fyrir verkefnið. Í
[kennaraskjalinu okkar](${TEACHER_DOC}){target=_blank} (á norsku)
er meðal annars lýst ýmsum leiðum til þess, auk annarra gagnlegra ráða um
forritunarkennslu.

## Forkröfur og búnaður {.challenge}

- [ ] **Forkröfur**:

- [ ] **Búnaður**:

## Framkvæmd

Hér koma ábendingar, reynsla og áskoranir fyrir hvert skref í verkefninu.

# Skref 1:... {.activity}

- [ ] Hér er algengt vandamál að ...

# Skref 2: ... {.activity}

- [ ] Nemendur þurfa að ...

**EÐA**

*Því miður höfum við engar ábendingar, reynslu eða áskoranir fyrir þetta verkefni
enn.*

## Tilbrigði {.challenge}

- [ ]  Nemendur geta búið til ...

**EÐA**

- [ ]  *Því miður höfum við engin tilbrigði við þetta verkefni enn.*

## Önnur gögn {.challenge}

- [ ] Kynningarmyndband um …

**EÐA**

- [ ] Engin önnur gögn enn ...`;

const frTeacher = `**Modèle pour un nouveau guide de l'enseignant**

Vous pouvez modifier ce texte librement.

# À propos de l'activité {.activity}

Dans cette activité...

## L'activité convient pour : {.check}

**Matière** : {subject}

**Niveaux recommandés** : {grade}

**Thème** : {topic}

**Durée** :

## Compétences visées {.challenge}

- [ ] **Matière, niveau** :

## Objectifs d'apprentissage proposés {.challenge}

- [ ] Les élèves savent...

## Critères d'évaluation proposés {.challenge}

Il existe de nombreuses façons d'évaluer un projet de programmation. Choisissez
celle qui convient à la matière, à l'âge et au niveau des élèves, à ce que vous
voulez évaluer et au temps dont vous disposez pour le projet. Notre
[document pour les enseignants](${TEACHER_DOC}){target=_blank} (en
norvégien) décrit plusieurs façons de le faire, ainsi que d'autres conseils
utiles pour enseigner la programmation.

## Prérequis et matériel {.challenge}

- [ ] **Prérequis** :

- [ ] **Matériel** :

## Déroulement

Conseils, expériences et difficultés pour chaque étape de l'activité.

# Étape 1 :... {.activity}

- [ ] Un problème fréquent ici est que ...

# Étape 2 : ... {.activity}

- [ ] Les élèves doivent ...

**OU**

*Nous n'avons malheureusement pas encore de conseils, d'expériences ou de
difficultés pour cette activité.*

## Variantes {.challenge}

- [ ]  Les élèves peuvent créer ...

**OU**

- [ ]  *Nous n'avons malheureusement pas encore de variantes pour cette activité.*

## Ressources externes {.challenge}

- [ ] Une vidéo d'introduction sur …

**OU**

- [ ] Pas encore de ressources externes ...`;

const uaTeacher = `**Шаблон для нового посібника для вчителя**

Цей текст можна сміливо редагувати.

# Про завдання {.activity}

У цьому завданні...

## Завдання підходить для: {.check}

**Предмет**: {subject}

**Рекомендовані класи**: {grade}

**Тема**: {topic}

**Тривалість**:

## Очікувані результати навчання {.challenge}

- [ ] **Предмет, клас**:

## Запропоновані навчальні цілі {.challenge}

- [ ] Учні вміють...

## Запропоновані критерії оцінювання {.challenge}

Є багато способів оцінити проєкт із програмування. Оберіть той, що найкраще
підходить для предмета, віку й рівня учнів, того, що ви хочете оцінити, і часу,
який ви маєте на проєкт. У нашому
[документі для вчителів](${TEACHER_DOC}){target=_blank} (норвезькою)
описано різні способи, а також інші корисні поради щодо навчання програмування.

## Передумови та обладнання {.challenge}

- [ ] **Передумови**:

- [ ] **Обладнання**:

## Хід роботи

Поради, досвід і труднощі для кожного кроку завдання.

# Крок 1:... {.activity}

- [ ] Тут часто трапляється проблема, що ...

# Крок 2: ... {.activity}

- [ ] Учні мають ...

**АБО**

*На жаль, у нас ще немає порад, досвіду чи труднощів для цього завдання.*

## Варіації {.challenge}

- [ ]  Учні можуть створити ...

**АБО**

- [ ]  *На жаль, у нас ще немає варіацій для цього завдання.*

## Зовнішні ресурси {.challenge}

- [ ] Вступне відео про …

**АБО**

- [ ] Поки що немає зовнішніх ресурсів ...`;

const LESSON_TEMPLATES: Record<string, string> = {
  nb: nbLesson,
  nn: nnLesson,
  en: enLesson,
  is: isLesson,
  fr: frLesson,
  ua: uaLesson,
};

const TEACHER_GUIDE_TEMPLATES: Record<string, string> = {
  nb: nbTeacher,
  nn: nnTeacher,
  en: enTeacher,
  is: isTeacher,
  fr: frTeacher,
  ua: uaTeacher,
};

/** The languages with their own templates; the others start from bokmål. */
export const TEMPLATE_LANGUAGES = Object.keys(LESSON_TEMPLATES);

const languageKey = (language?: string) => (language === "uk" ? "ua" : (language ?? "nb"));

/** The text a new lesson starts from, in its language (bokmål when there is no translation). */
export const lessonTemplate = (language?: string): string =>
  LESSON_TEMPLATES[languageKey(language)] ?? nbLesson;

/** The text a new teacher guide starts from; {subject}, {grade} and {topic} are filled in later. */
export const teacherGuideTemplate = (language?: string): string =>
  TEACHER_GUIDE_TEMPLATES[languageKey(language)] ?? nbTeacher;
