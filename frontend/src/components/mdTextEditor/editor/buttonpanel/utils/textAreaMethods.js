import { KEY_COMBINATIONS as KEY } from "../../../settingsFiles/buttonConfig";

const keyMap = {
  PREVIEW: KEY.preview.join(""),
  BOLD: KEY.bold.join(""),
  ITALIC: KEY.italic.join(""),
  HEADING: KEY.heading.join(""),
  STRIKETHROUGH: KEY.strikethrough.join(""),
  UNDO: KEY.undo.join(""),
  REDO: KEY.redo.join(""),
  NEW: KEY.new.join(""),
  LOAD: KEY.load.join(""),
  SAVE: KEY.save.join(""),
  IMAGE: KEY.image.join(""),
  LISTUL: KEY.listul.join(""),
  LISTOL: KEY.listol.join(""),
  CHECKLIST: KEY.listcheck.join(""),
  ACTIVITY: KEY.activity.join(""),
  INTRO: KEY.intro.join(""),
  CHECK: KEY.check.join(""),
  TIP: KEY.tip.join(""),
  PROTIP: KEY.protip.join(""),
  CHALLENGE: KEY.challenge.join(""),
  FLAG: KEY.flag.join(""),
  TRY: KEY.try.join(""),
  INLINE: KEY.inline.join(""),
  CODEBLOCK: KEY.codeblock.join(""),
};

// const handlers = {
//   // preview button
//   PREVIEW: () => handlePreview(true),

//   // emphasis
//   BOLD: () =>
//     newHandleButtonClick(
//       emphasis[0].buttonTitle,
//       emphasis[0].output,
//       emphasis[0].cursorIntON,
//       emphasis[0].cursorIntOFF,
//       emphasis[0].endOutput
//     ),
//   ITALIC: () =>
//     newHandleButtonClick(
//       emphasis[1].buttonTitle,
//       emphasis[1].output,
//       emphasis[1].cursorIntON,
//       emphasis[1].cursorIntOFF,
//       emphasis[1].endOutput
//     ),
//   HEADING: () =>
//     newHandleButtonClick(
//       emphasis[2].buttonTitle,
//       emphasis[2].output,
//       emphasis[2].cursorIntON,
//       emphasis[2].cursorIntOFF,
//       emphasis[2].endOutput
//     ),
//   STRIKETHROUGH: () =>
//     newHandleButtonClick(
//       emphasis[3].buttonTitle,
//       emphasis[3].output,
//       emphasis[3].cursorIntON,
//       emphasis[3].cursorIntOFF,
//       emphasis[3].endOutput
//     ),

//   //undoRedo
//   UNDO: () =>
//     newHandleButtonClick(
//       undoRedo[0].buttonTitle,
//       undoRedo[0].output,
//       undoRedo[0].cursorIntON,
//       undoRedo[0].cursorIntOFF,
//       undoRedo[0].endOutput
//     ),
//   REDO: () =>
//     newHandleButtonClick(
//       undoRedo[1].buttonTitle,
//       undoRedo[1].output,
//       undoRedo[1].cursorIntON,
//       undoRedo[1].cursorIntOFF,
//       undoRedo[1].endOutput
//     ),

//   //saveLoadNew
//   NEW: () =>
//     newHandleButtonClick(
//       saveLoadNew[0].buttonTitle,
//       saveLoadNew[0].output,
//       saveLoadNew[0].cursorIntON,
//       saveLoadNew[0].cursorIntOFF,
//       saveLoadNew[0].endOutput
//     ),
//   LOAD: () =>
//     newHandleButtonClick(
//       saveLoadNew[1].buttonTitle,
//       saveLoadNew[1].output,
//       saveLoadNew[1].cursorIntON,
//       saveLoadNew[1].cursorIntOFF,
//       saveLoadNew[1].endOutput
//     ),
//   SAVE: () =>
//     newHandleButtonClick(
//       saveLoadNew[2].buttonTitle,
//       saveLoadNew[2].output,
//       saveLoadNew[2].cursorIntON,
//       saveLoadNew[2].cursorIntOFF,
//       saveLoadNew[2].endOutput
//     ),

//   //image
//   IMAGE: () =>
//     newHandleButtonClick(
//       image[0].buttonTitle,
//       image[0].output,
//       image[0].cursorIntON,
//       image[0].cursorIntOFF,
//       image[0].endOutput
//     ),

//   //lists
//   LISTUL: () =>
//     newHandleButtonClick(
//       lists[0].buttonTitle,
//       lists[0].output,
//       lists[0].cursorIntON,
//       lists[0].cursorIntOFF,
//       lists[0].endOutput
//     ),
//   LISTOL: () =>
//     newHandleButtonClick(
//       lists[1].buttonTitle,
//       lists[1].output,
//       lists[1].cursorIntON,
//       lists[1].cursorIntOFF,
//       lists[1].endOutput
//     ),
//   CHECKLIST: () =>
//     newHandleButtonClick(
//       lists[2].buttonTitle,
//       lists[2].output,
//       lists[2].cursorIntON,
//       lists[2].cursorIntOFF,
//       lists[2].endOutput
//     ),

//   //sections
//   ACTIVITY: () =>
//     newHandleButtonClick(
//       sections[0].buttonTitle,
//       sections[0].output,
//       sections[0].cursorIntON,
//       sections[0].cursorIntOFF,
//       sections[0].endOutput
//     ),
//   INTRO: () =>
//     newHandleButtonClick(
//       sections[1].buttonTitle,
//       sections[1].output,
//       sections[1].cursorIntON,
//       sections[1].cursorIntOFF,
//       sections[1].endOutput
//     ),
//   CHECK: () =>
//     newHandleButtonClick(
//       sections[2].buttonTitle,
//       sections[2].output,
//       sections[2].cursorIntON,
//       sections[2].cursorIntOFF,
//       sections[2].endOutput
//     ),
//   TIP: () =>
//     newHandleButtonClick(
//       sections[3].buttonTitle,
//       sections[3].output,
//       sections[3].cursorIntON,
//       sections[3].cursorIntOFF,
//       sections[3].endOutput
//     ),
//   PROTIP: () =>
//     newHandleButtonClick(
//       sections[4].buttonTitle,
//       sections[4].output,
//       sections[4].cursorIntON,
//       sections[4].cursorIntOFF,
//       sections[4].endOutput
//     ),
//   CHALLENGE: () =>
//     newHandleButtonClick(
//       sections[5].buttonTitle,
//       sections[5].output,
//       sections[5].cursorIntON,
//       sections[5].cursorIntOFF,
//       sections[5].endOutput
//     ),
//   FLAG: () =>
//     newHandleButtonClick(
//       sections[6].buttonTitle,
//       sections[6].output,
//       sections[6].cursorIntON,
//       sections[6].cursorIntOFF,
//       sections[6].endOutput
//     ),
//   TRY: () =>
//     newHandleButtonClick(
//       sections[7].buttonTitle,
//       sections[7].output,
//       sections[7].cursorIntON,
//       sections[7].cursorIntOFF,
//       sections[7].endOutput
//     ),

//   //code
//   INLINE: () =>
//     newHandleButtonClick(
//       code[0].buttonTitle,
//       code[0].output,
//       code[0].cursorIntON,
//       code[0].cursorIntOFF,
//       code[0].endOutput
//     ),
//   CODEBLOCK: () =>
//     newHandleButtonClick(
//       code[1].buttonTitle,
//       code[1].output,
//       code[1].cursorIntON,
//       code[1].cursorIntOFF,
//       code[1].endOutput
//     )
// };

export { keyMap };
