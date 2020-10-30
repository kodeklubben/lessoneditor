import Axios from "axios";
import yaml from "js-yaml";

const COURSESLISTold = [
  { courseTitle: "App Inventor", slug: "appinventor" },
  { courseTitle: "Arduino", slug: "arduino" },
  { courseTitle: "Code Studio", slug: "codestudio" },
  { courseTitle: "Computer Craft", slug: "computercraft" },
  { courseTitle: "Elm", slug: "elm" },
  { courseTitle: "Lego Mindstorms", slug: "legomindstorms" },
  { courseTitle: "Micro:bit", slug: "microbit" },
  { courseTitle: "Processing", slug: "processing" },
  { courseTitle: "Python", slug: "python" },
  { courseTitle: "Scratch", slug: "scratch" },
  { courseTitle: "Web", slug: "web" },
  { courseTitle: "Uten Datamaskin", slug: "uten_datamaskin" },
];

const GITHUB_URL =
  "https://api.github.com/repos/kodeklubben/oppgaver/contents/src/";

let COURSESLIST = [];

async function fecthData() {
  const getCourseList = () =>
    Axios.get(GITHUB_URL)
      .then((response) => response.data)
      .catch((error) => {
        console.log(error);
        COURSESLIST = COURSESLISTold;
      });

  const test1 = await getCourseList();

  const getCourseTitle = (i) =>
    Axios.get(GITHUB_URL + i.name + "/index.md")
      .then((response) => {
        let buff = new Buffer.from(response.data.content, "base64");
        let text = yaml.safeLoad(buff.toString("utf8").split("---")[1]);
        return text.title;
      })
      .catch((error) => {
        console.log(error);
      });

  if (typeof test1 !== "undefined") {
    for (let i of test1) {
      if (i.type === "dir") {
        if (i.name === "sponsorer") continue;
        const title = await getCourseTitle(i);
        COURSESLIST = [
          ...COURSESLIST,
          {
            courseTitle: title,
            slug: i.name,
          },
        ];
      }
    }
  } else {
    COURSESLIST = COURSESLISTold;
  }
}
fecthData();

export { COURSESLIST };
