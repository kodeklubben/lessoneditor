require("dotenv").config({ path: __dirname + "/.env" });
const submit = require("../src/githubAPI/submitLesson");
const token = process.env.GITHUB_ACCESS_TOKEN;

const lessonData = {
  course: "python",
  title: "min-fine-oppgave",
  author: "Benjamin Aune Brekken",
  translator: "",
  language: "nb",
  yml: {
    level: 2,
    license: "CC BY-SA 4.0",
    tags: {
      topic: ["this", "and", "that"],
      subject: ["to", "be", "not"],
      grade: ["all", "of", "them"],
    },
  },
  markdown: `
# Hello {.activity}
    
![filnavn: randomPic1.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-1.jpg)
![filnavn: randomPic2.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-2.jpg)
![filnavn: randomPic3.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-3.jpg)
![filnavn: randomPic4.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-4.jpg)
![filnavn: randomPic5.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-5.jpg)
    
# Some other shit {.activity}

This is some other shit.

`,
};

submit(token, lessonData);
