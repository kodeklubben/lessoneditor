import md5 from "crypto-js/md5";

let language: any;

const microbitIframeId = "makecoderenderer";
const getMicrobitSnippets = (): HTMLDivElement[] => {
  return Array.from(document.getElementsByClassName("microbit")).map(
    (element) => {
      return element as HTMLDivElement;
    }
  );
};

const renderSpinner = () => {
  getMicrobitSnippets().forEach((codeBlock) => {
    codeBlock.style.borderStyle = "none";
    codeBlock.style.color = "#f5f5f5";
    const preSize = codeBlock.getBoundingClientRect();
    let img = document.createElement("img");
    img.className = "spinner";
    img.src = "/spinner.gif";
    img.alt = "Spinner";
    img.width = 50;
    img.height = 50;
    img.style.maxWidth = "100%";
    img.style.display = "block";
    img.style.margin = "0 auto 15px";
    img.style.position = "absolute";
    img.style.top = preSize.height / 2 + "px";
    img.style.left = preSize.width / 2 + "px";
    // @ts-ignore
    codeBlock.parentElement.insertBefore(img, codeBlock);
  });
};

/**
 * Creates an iframe that is being used to render the code
 * @param {object} language Lesson language
 */
const createIframe = (language: string) => {
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
    nb: "nb", // Norwegian
    nn: "nn-NO", // Norwegian
    sv: "sv-SE", // Swedish
    tr: "tr" // Turkish
  };
  const f = document.createElement("iframe");
  f.addEventListener("load", (e) => {
    // console.log("microbit iframe loaded.");
  });
  f.id = microbitIframeId;
  f.style.position = "absolute";
  f.style.left = String(0);
  f.style.bottom = String(0);
  f.style.width = "1px";
  f.style.height = "1px";
  if (language in microbitLanguages) {
    f.src =
      "https://makecode.microbit.org/--docs?render=1&lang=" +
      // @ts-ignore
      microbitLanguages[language];
  } else {
    f.src = "https://makecode.microbit.org/--docs?render=1&lang=nb";
  }
  document.body.appendChild(f);
  window.addEventListener("message", processIframeMessage);
};

const msgCache = {};
// Taken from https://makecode.microbit.org/blocks-embed
const renderSnippets = () => {
  const iframe = document.getElementById(microbitIframeId);
  getMicrobitSnippets().forEach((codeBlock) => {
    const checksum = md5(codeBlock.innerText).toString();
    // @ts-ignore
    if (msgCache[checksum]) {
      // @ts-ignore
      createImage(msgCache[checksum]);
    } else {
      // @ts-ignore
      iframe.contentWindow.postMessage(
        {
          type: "renderblocks",
          id: checksum,
          code: codeBlock.innerText
        },
        "https://makecode.microbit.org/"
      );
    }
  });
  cleanUpCache();
};
const cleanUpCache = () => {
  const activeImages = Array.from(document.getElementsByTagName("img")).map(
    (tag) => {
      return tag.src;
    }
  );
  for (const msgId in msgCache) {
    // @ts-ignore
    const msgSrc = msgCache[msgId].src;
    if (!activeImages.includes(msgSrc)) {
      // @ts-ignore
      delete msgCache[msgId];
      URL.revokeObjectURL(msgSrc);
    }
  }
};
/**
 * Creates an image from the rendered microbit code
 * @param {object} msg
 */
const createImage = (msg: {
  src: string;
  width: number;
  height: number;
  id: string;
}) => {
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
          // @ts-ignore
          codeBlock.parentElement.getElementsByClassName("spinner")
        ).forEach((element) => {
          element.remove();
        });
        // @ts-ignore
        codeBlock.parentElement.insertBefore(img, codeBlock);
        // @ts-ignore
        codeBlock.parentElement.removeChild(codeBlock);
      }
    }
  });
};

const removeIframe = () => {
  window.removeEventListener("message", processIframeMessage);
  // @ts-ignore
  document.getElementById(microbitIframeId).remove();
  //console.log('Microbit iframe removed');
};

const processIframeMessage = (e: { data: any }) => {
  let msg = e.data;
  if (msg.source === "makecode") {
    if (msg.type === "renderready") {
      renderSnippets();
    } else if (msg.type === "renderblocks") {
      // @ts-ignore
      msgCache[msg.id] = {
        id: msg.id,
        width: msg.width,
        height: msg.height,
        src: URL.createObjectURL(
          new Blob([msg.svg], { type: "image/svg+xml" })
        )
      };
      // @ts-ignore
      createImage(msgCache[msg.id]);
      removeIframe();
      if (document.getElementsByClassName("spinner").length > 0) {
        createIframe(language);
      }
    }
  }
};

export const renderMicrobit = (lang: any) => {
  language = lang;
  const existingFrame = document.getElementById(microbitIframeId);
  renderSpinner();
  if (getMicrobitSnippets().length > 0 && !existingFrame) {
    createIframe(lang);
  } else {
    renderSnippets();
  }
};
