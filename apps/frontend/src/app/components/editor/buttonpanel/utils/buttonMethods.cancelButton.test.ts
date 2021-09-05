import { buttonAction, cancelButton } from "./buttonMethods";
import { emphasis, lists, sections } from "../settings/buttonConfig";
import { SECTION_TEXT } from "../../settingsFiles/languages/editor_NO";

describe("cancelButton", () => {
  it("should remove bold string caused by buttonpress AKA cancel buttonpress", () => {
    const results = buttonAction(
      false,
      "dette er en test",
      2,
      2,
      emphasis.bold.cursorIntON,
      emphasis.bold.cursorIntOFF,
      emphasis.bold.output
    );

    const results2 = cancelButton(
      true,
      results.mdText,
      results.cursorPositionStart,
      results.cursorPositionEnd,
      emphasis.bold.cursorIntON,
      emphasis.bold.output
    );

    expect(results2.mdText).toBe("dette er en test");
    expect(results2.cursorPositionStart).toBe(2);
    expect(results2.cursorPositionEnd).toBe(2);
  });

  it("should remove list caused by buttonpress AKA cancel buttonpress", () => {
    const results = buttonAction(
      false,
      "dette er en test",
      2,
      2,
      lists.listUl.cursorIntON,
      lists.listUl.cursorIntOFF,
      lists.listUl.output
    );

    const results2 = cancelButton(
      true,
      results.mdText,
      results.cursorPositionStart,
      results.cursorPositionEnd,
      lists.listUl.cursorIntON,
      lists.listUl.output
    );

    expect(results2.mdText).toBe("dette er en test");
    expect(results2.cursorPositionStart).toBe(2);
    expect(results2.cursorPositionEnd).toBe(2);
  });

  it("shoult remove sectiontext caused by buttonpress AKA cancel buttonpress", () => {
    const results = buttonAction(
      false,
      "dette er en test",
      2,
      2,
      sections.activity.cursorIntON,
      sections.activity.cursorIntOFF,
      sections.activity.output
    );

    const results2 = cancelButton(
      true,
      results.mdText,
      results.cursorPositionStart,
      results.cursorPositionEnd,
      sections.activity.cursorIntON,
      sections.activity.output
    );

    expect(results2.mdText).toBe("dette er en test");
    expect(results2.cursorPositionStart).toBe(2);
    expect(results2.cursorPositionEnd).toBe(2);
  });
});
