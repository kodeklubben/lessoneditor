const yaml = require("js-yaml");
module.exports = () => {
  return {
    files: [
      {
        filename: "lesson.yml",
        ext: "yml",
        content: yaml.dump({
          level: 2,
          license: "CC BY-SA 4.0",
          tags: {
            topic: ["this", "and", "that"],
            subject: ["to", "be", "not"],
            grade: ["all", "of", "them"],
          },
        }),
      },
      {
        filename: "lesson.md",
        ext: "md",
        content: `
# Hello {.activity}
    
![filnavn: randomPic1.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-1.jpg)
![filnavn: randomPic2.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-2.jpg)
![filnavn: randomPic3.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-3.jpg)
![filnavn: randomPic4.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-4.jpg)
![filnavn: randomPic5.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-5.jpg)
    
# Some other shit {.activity}

This is some other shit.

`,
      },
    ],
    meta: {
      course: "python",
      title: "min-fine-oppgave",
      author: "Benjamin Aune Brekken",
      translator: "",
      language: "nb",
    },
  };
};
