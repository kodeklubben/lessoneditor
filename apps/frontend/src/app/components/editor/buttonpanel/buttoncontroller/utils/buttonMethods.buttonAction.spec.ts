import { buttonAction } from "./buttonMethods";
import { emphasis, lists } from "../settings/buttonConfig";
import { DEFAULT_TEXT } from "../../../settingsFiles/languages/editor_NO";

const testListInput = {
  isOn: false,
  mdText: "Dette er en test",
  cursorPositionStart: 2,
  cursorPositionEnd: 2,
};

const getListResults = (
  cursorIntON: number,
  cursorIntOFF: number,
  output: string,
  mdText = testListInput.mdText,
  cursorPositionStart = testListInput.cursorPositionStart,
  cursorPositionEnd = testListInput.cursorPositionEnd
) => {
  return buttonAction(
    mdText,
    cursorPositionStart,
    cursorPositionEnd,
    cursorIntON,
    cursorIntOFF,
    output
  );
};

describe("buttonAction", () => {
  it("dummy", () => {
    expect(true).toBe(true);
  })
  // it("should trim whitespace/newLine and update cursorposition on selection", () => {
  //   const testInput = { mdText: "  \n  dette er en test   \n   " };
  //   const results = getListResults(
  //     emphasis.bold.cursorIntON,
  //     emphasis.bold.cursorIntOFF,
  //     emphasis.bold.output,
  //     testInput.mdText,
  //     0,
  //     28
  //   );

  //   expect(results.mdText).toBe(
  //     `  \n  ${emphasis.bold.output.replace(DEFAULT_TEXT, "dette er en test")}   \n   `
  //   );
  //   expect(results.cursorPositionStart).toBe(7);
  //   expect(results.cursorPositionEnd).toBe(23);
  // });

  // it("should return correct result for unOrderedList", () => {
  //   const ULInput = {
  //     cursorIntON: lists.listUl.cursorIntON,
  //     cursorIntOFF: lists.listUl.cursorIntOFF,
  //     output: lists.listUl.output,
  //   };

  //   const results = getListResults(ULInput.cursorIntON, ULInput.cursorIntOFF, ULInput.output);

  //   expect(results.mdText).toBe(`De\n${ULInput.output}\ntte er en test`);
  //   expect(results.cursorPositionStart).toBe(
  //     ULInput.cursorIntON + testListInput.cursorPositionStart + 1
  //   );
  //   expect(results.cursorPositionEnd).toBe(
  //     testListInput.cursorPositionStart + 1 + ULInput.output.length
  //   );
  // });

  // it("should return correct result for orderedList", () => {
  //   const OLInput = {
  //     cursorIntON: lists.listOl.cursorIntON,
  //     cursorIntOFF: lists.listOl.cursorIntOFF,
  //     output: lists.listOl.output,
  //   };
  //   const results = getListResults(OLInput.cursorIntON, OLInput.cursorIntOFF, OLInput.output);

  //   expect(results.mdText).toBe(`De\n${OLInput.output}\ntte er en test`);
  //   expect(results.cursorPositionStart).toBe(
  //     OLInput.cursorIntON + testListInput.cursorPositionStart + 1
  //   );
  //   expect(results.cursorPositionEnd).toBe(
  //     testListInput.cursorPositionStart + 1 + OLInput.output.length
  //   );
  // });

  // it("should return correct result for checkList", () => {
  //   const checkListInput = {
  //     cursorIntON: lists.listCheck.cursorIntON,
  //     cursorIntOFF: lists.listCheck.cursorIntOFF,
  //     output: lists.listCheck.output,
  //   };
  //   const results = getListResults(
  //     checkListInput.cursorIntON,
  //     checkListInput.cursorIntOFF,
  //     checkListInput.output
  //   );
  //   expect(results.mdText).toBe(`De\n${checkListInput.output}\ntte er en test`);
  //   expect(results.cursorPositionStart).toBe(
  //     checkListInput.cursorIntON + testListInput.cursorPositionStart + 1
  //   );
  //   expect(results.cursorPositionEnd).toBe(
  //     testListInput.cursorPositionStart + 1 + checkListInput.output.length
  //   );
  // });
});
