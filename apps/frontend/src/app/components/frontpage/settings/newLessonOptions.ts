import nbFlag from "../../../../assets/public/languagesFlag/flag_nb.svg";
import nnFlag from "../../../../assets/public/languagesFlag/flag_nn.svg";
import enFlag from "../../../../assets/public/languagesFlag/flag_en.svg";
import isFlag from "../../../../assets/public/languagesFlag/flag_is.svg";
import frFlag from "../../../../assets/public/languagesFlag/flag_fr.svg";
import samFlag from "../../../../assets/public/languagesFlag/flag_sam.svg";

export const LANGUAGEOPTIONS: Record<string, any>[] = [
  {
    key: "nb",
    text: "Bokmål",
    value: "nb",
    image: { avatar: true, src: nbFlag },
  },
  {
    key: "nn",
    text: "Nynorsk",
    value: "nn",
    image: { avatar: true, src: nnFlag },
  },
  {
    key: "sam",
    text: "Samisk",
    value: "sam",
    image: { avatar: true, src: samFlag },
  },
  {
    key: "en",
    text: "Engelsk",
    value: "en",
    image: { avatar: true, src: enFlag },
  },
  {
    key: "is",
    text: "Islandsk",
    value: "is",
    image: { avatar: true, src: isFlag },
  },
  {
    key: "fr",
    text: "Fransk",
    value: "fr",
    image: { avatar: true, src: frFlag },
  },
];

export const COURSESLIST: { key: any; text: any; value: any }[] = [
  {
    key: "appinventor",
    text: "App Inventor",
    value: "appinventor",
  },
  {
    key: "arduino",
    text: "Arduino",
    value: "arduino",
  },
  {
    key: "codestudio",
    text: "Code Studio",
    value: "codestudio",
  },
  {
    key: "computercraft",
    text: "Computer Craft",
    value: "computercraft",
  },
  {
    key: "diverse",
    text: "Diverse",
    value: "diverse",
  },
  {
    key: "elm",
    text: "Elm",
    value: "elm",
  },
  {
    key: "lego",
    text: "Lego",
    value: "lego",
  },
  {
    key: "legomindstorms",
    text: "Lego Mindstorms",
    value: "legomindstorms",
  },
  {
    key: "microbit",
    text: "Micro:bit",
    value: "microbit",
  },
  {
    key: "processing",
    text: "Processing",
    value: "processing",
  },
  {
    key: "python",
    text: "Python",
    value: "python",
  },
  {
    key: "scratch",
    text: "Scratch",
    value: "scratch",
  },
  {
    key: "scratchjr",
    text: "Scratch Jr",
    value: "scratchjr",
  },
  {
    key: "web",
    text: "Web",
    value: "web",
  },
  {
    key: "uten_datamaskin",
    text: "Uten Datamaskin",
    value: "uten_datamaskin",
  },
];
