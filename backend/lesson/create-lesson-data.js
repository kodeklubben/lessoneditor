const saveFile = require("../storage/save-file");
const lessonInit = require("../utils/lesson-init");

const welcomeText = `# Velkommen til kidsakoder sin tekstbehandler! {.intro}

Dette er kidsakoder sin egen tekstbehandler for å lage, og redigere, sine oppgaver

# Steg 1: Hva fungerer {.activity}



## Du kan endre språk i panelet {.check}
## Du kan også endre metadata i innstillinger {.protip}



## Teksten lagres automatisk underveis{.save}

## Enjoy!  {.flag}`;

module.exports = async (lessonData, username, edit = false) => {
  const data = lessonInit(lessonData, username);
  const dataBuffer = Buffer.from(JSON.stringify(data));
  const ymlBuffer = Buffer.from(JSON.stringify({}));
  if (!edit) {
    await saveFile(
      ["drafts", data.lessonId, data.lesson + ".md"],
      Buffer.from(welcomeText + data.title)
    );
  }
  await saveFile(["drafts", data.lessonId, "data.json"], dataBuffer);
  await saveFile(["drafts", data.lessonId, "lesson.yml"], ymlBuffer);
  return data;
};
