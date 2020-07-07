import md5 from "crypto-js/md5";

const microbitIframeId = "makecoderenderer";
const getMicrobitSnippets = () =>
  Array.from(document.getElementsByClassName("microbit"));

const renderSpinner = () => {
  getMicrobitSnippets().forEach((codeBlock) => {
    const pres = [...document.getElementsByTagName("pre")];
    pres.forEach((pre) => {
      pre.style.backgroundColor = "#fff";
      pre.style.borderStyle = "none";
    });
    codeBlock.style.borderStyle = "none";
    codeBlock.style.color = "#999";
    const preSize = codeBlock.getBoundingClientRect();
    let img = document.createElement("img");
    img.className = "spinner";
    img.src = require("assets/graphics/spinner.gif");
    img.alt = "Spinner";
    img.width = 50;
    img.height = 50;
    img.style.maxWidth = "100%";
    img.style.display = "block";
    img.style.margin = "0 auto 15px";
    img.style.position = "absolute";
    img.style.top = preSize.height / 2 + "px";
    img.style.left = preSize.width / 2 + "px";
    codeBlock.parentElement.insertBefore(img, codeBlock);
  });
};

/**
 * Creates an iframe that is being used to render the code
 * @param {object} language Lesson language
 */
const createIframe = (language) => {
  const microbitLanguages = {
    // Taken from https://support.crowdin.com/api/language-codes/
    da: "da", // Danish
    de: "de", // German
    el: "el", // Greek
    en: "en", // English
    es: "es-ES", // Spanish
    fi: "fi", // Finnish
    fr: "fr", //French
    hu: "hu", // Hungarian
    is: "is", // Icelandic
    it: "it", // Italian
    nl: "nl", // Dutch
    nb: "no", // Norwegian
    nn: "no", // Norwegian
    sv: "sv-SE", // Swedish
    tr: "tr", // Turkish
  };
  const f = document.createElement("iframe");
  f.addEventListener("load", (e) => {
    // console.log("microbit iframe loaded.");
  });
  f.id = microbitIframeId;
  f.style.position = "absolute";
  f.style.left = 0;
  f.style.bottom = 0;
  f.style.width = "1px";
  f.style.height = "1px";
  if (language in microbitLanguages) {
    f.src =
      "https://makecode.microbit.org/--docs?render=1&lang=" +
      microbitLanguages[language];
  } else {
    f.src = "https://makecode.microbit.org/--docs?render=1&lang=en";
  }
  document.body.appendChild(f);
  window.addEventListener("message", processIframeMessage);
};

const msgCache = {};
// Taken from https://makecode.microbit.org/blocks-embed
const renderSnippets = () => {
  const f = document.getElementById(microbitIframeId);
  getMicrobitSnippets().forEach((codeBlock) => {
    const checksum = md5(codeBlock.innerText).toString();
    if (msgCache[checksum]) {
      createImage(msgCache[checksum]);
    } else {
      f.contentWindow.postMessage(
        {
          type: "renderblocks",
          id: checksum,
          code: codeBlock.innerText,
        },
        "https://makecode.microbit.org/"
      );
    }
  });
};

/**
 * Creates an image from the rendered microbit code
 * @param {object} msg
 */
const createImage = (msg) => {
  let img = document.createElement("img");
  img.src = msg.src;
  img.width = msg.width;
  img.height = msg.height;
  img.style.display = "block";
  img.style.margin = "0 auto 15px";
  img.style.maxWidth = "100%";
  getMicrobitSnippets().forEach((codeBlock) => {
    if (md5(codeBlock.innerText).toString() === msg.id) {
      if (codeBlock.className === "microbit") {
        Array.from(
          codeBlock.parentElement.getElementsByClassName("spinner")
        ).forEach((element) => {
          element.remove();
        });
        codeBlock.parentElement.insertBefore(img, codeBlock);
        codeBlock.parentElement.removeChild(codeBlock);
      }
    }
  });
};

const processIframeMessage = (e) => {
  let msg = e.data;
  if (msg.source === "makecode") {
    if (msg.type === "renderready") {
      renderSnippets();
    } else if (msg.type === "renderblocks") {
      msg.src = URL.createObjectURL(
        new Blob([msg.svg], { type: "image/svg+xml" })
      );
      createImage(msg);
      msgCache[msg.id] = msg;
    }
  }
};

export const renderMicrobit = (language) => {
  const existingFrame = document.getElementById(microbitIframeId);
  renderSpinner();
  if (getMicrobitSnippets().length > 0 && !existingFrame) {
    createIframe(language);
  } else {
    renderSnippets();
  }
};
