import { buttonAction, cancelButton } from "./buttonMethods";
import { emphasis, lists, sections } from "../settings/buttonConfig";

describe("cancelButton", () => {
  it("should remove bold on buttonpress ", () => {
    const results = buttonAction(
      "dette er en test",
      4,
      4,
      emphasis.bold.cursorIntON,
      emphasis.bold.cursorIntOFF,
      emphasis.bold.output
    );

    const results2 = cancelButton(
      results.mdText,
      results.cursorPositionStart,
      results.cursorPositionEnd,
      emphasis.bold.cursorIntON,
      emphasis.bold.output
    );

    expect(results2.mdText).toBe("dette er en test");
    expect(results2.cursorPositionStart).toBe(4);
    expect(results2.cursorPositionEnd).toBe(4);
  });

  it("should remove list on buttonpress", () => {
    const results = buttonAction(
      "dette er en test",
      4,
      4,
      lists.listUl.cursorIntON,
      lists.listUl.cursorIntOFF,
      lists.listUl.output
    );

    const results2 = cancelButton(
      results.mdText,
      results.cursorPositionStart,
      results.cursorPositionEnd,
      lists.listUl.cursorIntON,
      lists.listUl.output
    );

    expect(results2.mdText).toBe("dette er en test");
    expect(results2.cursorPositionStart).toBe(4);
    expect(results2.cursorPositionEnd).toBe(4);
  });

  it("shoult remove sectiontext on buttonpress", () => {
    const test1 = buttonAction(
      "dette er en test",
      4,
      4,
      sections.activity.cursorIntON,
      sections.activity.cursorIntOFF,
      sections.activity.output
    );

    const resultsTest1 = cancelButton(
      test1.mdText,
      test1.cursorPositionStart,
      test1.cursorPositionEnd,
      sections.activity.cursorIntON,
      sections.activity.output
    );

    const test2 = buttonAction(
      `dette er en test
      
      dette er også en linje`,
      17,
      17,
      sections.activity.cursorIntON,
      sections.activity.cursorIntOFF,
      sections.activity.output
    );

    const resultsTest2 = cancelButton(
      test2.mdText,
      test2.cursorPositionStart,
      test2.cursorPositionEnd,
      sections.activity.cursorIntON,
      sections.activity.output
    );

    expect(resultsTest2.mdText).toBe(`dette er en test
      
    dette er også en linje`);
    expect(resultsTest2.cursorPositionStart).toBe(4);
    expect(resultsTest2.cursorPositionEnd).toBe(4);
  });
});
