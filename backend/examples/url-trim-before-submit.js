const resolve = require("../src/utils/get-markdown-urls-submit");

const markdown = `
# Hello {.activity}
    
![filnavn: randomPic1.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-1.jpg)
![filnavn: randomPic2.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-2.jpg)
![filnavn: randomPic3.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-3.jpg)
![filnavn: randomPic4.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-4.jpg)
![filnavn: randomPic5.jpg](https://lokeshdhakar.com/projects/lightbox2/images/image-5.jpg)
    
# Some other shit {.activity}

This is some other shit.

`;

const resolveRes = resolve(markdown);
console.log(resolveRes);
