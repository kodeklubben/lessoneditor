import React from "react";
import "../../index.css";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import { mdParser } from "../../utils/mdParser";
import ControlPanel from "./ControlPanel";
import PageButtons from "../PageButtons";
import ImagePopup from "./ImagePopup";
// import { Redirect } from "react-router-dom";

// variabler som sjekker om en knapp er trykket ned:
var buttonBoolValues = {
  bold: true,
  italic: true,
  heading: true,
  strikethrough: true,
  undo: true,
  redo: true,
  new: true,
  load: true,
  save: true,
  image: true,
  listUl: true,
  listOl: true,
  listCheck: true,
  activity: true,
  intro: true,
  check: true,
  protip: true,
  challenge: true,
  inline: true,
  codeblock: true
};

// Hjelpevariabel for å formatere string taste-shortcut.
const temp = "```";

// Teller input-tegn for automatisk linjeksift etter 80 tegn
var charCounter = 0;

// Variabel for å spesifisere hoved-hurtigtast til React Hotkeys (tastesnarveier)
const SHORTCUTKEY = "ctrl";
const SHORTCUTKEY2 = "shift";

// her lagres tekesten når teksten autolagres/lagres
var storedTextValue = "";

// denne variabelen er nødvendig for at liste-knappene skal gi ønsket oppførsel med linjeskift
var listButtonValues = { bTitle: "", output: "", cursorInt: 0 };

// undo/redo - variabler.
var undo = [""];
var undoCursorPosition = [];
var redo = [];
var redoCursorPosition = [];

// her er inputText før den ender opp i state
var inputText = "";

// variabler for å spore pekere i tekstarea
var cursorPositionStart = 0;
var cursorPositionEnd = 0;

// meldingen i autosave
var autoSaveMessage = <br />;

// placeholder tag for bilde-upload popup
var imagePopup = <br />;

// ___________________

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
      textValue: "",
      mdValue: "",
      boolButton: buttonBoolValues
    };

    // referanseVariabel (type: GetDocumentByID i vanlig JS) for Textarea-elementet i DOM.  Tillater å manipulere DOM i react
    // brukes her til å flytte fokus fra knapp tilbake til textarea
    this.editorRef = React.createRef();
  }

  // en teller som brukes i forbindelse med autolagring
  componentDidMount() {
    this.myCounter = setInterval(() => {
      this.setState({ counter: this.state.counter + 1 });
    }, 1000);
  }

  // fjerner telleren
  componentWillUnmount() {
    clearInterval(this.myCounter);
  }

  // autolagring etter et par sekunder uten at teksten oppdateres
  componentDidUpdate() {
    if (this.state.counter === 2 && this.state.textValue.length > 0) {
      autoSaveMessage = "document saved";
    } else if (this.state.counter === 0) {
      autoSaveMessage = "saving..";
      storedTextValue = this.state.textValue;
    }
  }

  render() {
    const resetButtonOnOff = () => {
      buttonBoolValues = {
        bold: true,
        italic: true,
        heading: true,
        strikethrough: true,
        undo: true,
        redo: true,
        new: true,
        load: true,
        save: true,
        image: true,
        listUl: true,
        listOl: true,
        listCheck: true,
        activity: true,
        intro: true,
        check: true,
        protip: true,
        challenge: true,
        inline: true,
        codeblock: true
      };
    };

    // angi markørposisjon i tekstfelt
    const setCursorPosition = (positionStart, positionEnd) => {
      setTimeout(() => {
        this.editorRef.current.selectionStart = positionStart;
        this.editorRef.current.selectionEnd = positionEnd;
      }, 0);
    };

    // Submithandler,  kode for å sende tekst til backend skrives her her.
    const mySubmitHandler = event => {
      event.preventDefault();

      // TODO: Send inputtext-data to database
    };

    // all config for å behandle tekst i textarea
    const handleChange = event => {
      cursorPositionStart = event.target.selectionStart;
      cursorPositionEnd = event.target.selectionEnd;
      inputText = event.target.value;

      // Teller input-tegn, og tvinger linjeskift hvis det passerer 80 tegn
      charCounter += 1;

      if (charCounter === 80) {
        inputText += "\n";
        charCounter = 0;
      }

      // dytter tekstinput til state for å re-rendre siden.
      this.setState({ textValue: inputText });
      this.setState({ mdValue: mdParser(inputText) });
      this.setState({ counter: 0 });
    };

    const onTextareaKeyUp = e => {
      cursorPositionStart = e.target.selectionStart;
      cursorPositionEnd = e.target.selectionEnd;
    };

    const onTextareaSelect = e => {
      cursorPositionStart = e.target.selectionStart;
      cursorPositionEnd = e.target.selectionEnd;
    };

    const onTextareaMouseDown = e => {
      cursorPositionStart = e.target.selectionStart;
      cursorPositionEnd = e.target.selectionEnd;

      resetButtonOnOff();
    };

    // konfigurering for å fjerne default-funksjoner av tastekombinasjoner
    // brukes for å sette egne hurtigtaster i teksteditor.
    const onTextareaKeyDown = event => {
      cursorPositionStart = event.target.selectionStart;
      cursorPositionEnd = event.target.selectionEnd;

      // ctrl as shortcutKey
      const SHORTCUTKEYPRESS = event.ctrlKey;
      // shift as shortcutKey2
      const SHORTCUTKEYPRESS2 = event.shiftKey;

      const b = SHORTCUTKEYPRESS && event.keyCode === 66;
      const i = SHORTCUTKEYPRESS && event.keyCode === 73;
      const h = SHORTCUTKEYPRESS && event.keyCode === 72;
      const z = SHORTCUTKEYPRESS && event.keyCode === 188;
      const zz = SHORTCUTKEYPRESS && SHORTCUTKEYPRESS2 && event.keyCode === 188;
      const backspace =
        SHORTCUTKEYPRESS && event.shiftKey && event.keyCode === 8;
      const l = SHORTCUTKEYPRESS && SHORTCUTKEYPRESS2 && event.keyCode === 76;
      const s = SHORTCUTKEYPRESS && SHORTCUTKEYPRESS2 && event.keyCode === 83;
      const p = SHORTCUTKEYPRESS && event.keyCode === 80;
      const u = SHORTCUTKEYPRESS && event.keyCode === 85;
      const uu = SHORTCUTKEYPRESS && SHORTCUTKEYPRESS2 && event.keyCode === 85;
      const y = SHORTCUTKEYPRESS && event.keyCode === 89;
      const a = SHORTCUTKEYPRESS && SHORTCUTKEYPRESS2 && event.keyCode === 65;
      const ii = SHORTCUTKEYPRESS && SHORTCUTKEYPRESS2 && event.keyCode === 73;
      const e = SHORTCUTKEYPRESS && event.keyCode === 69;
      const k = SHORTCUTKEYPRESS && event.keyCode === 75;
      const leftArrow = event.keyCode === 37;
      const upArrow = event.keyCode === 38;
      const rightArrow = event.keyCode === 39;
      const downArrow = event.keyCode === 40;
      const spacebar = event.keyCode === 32;
      const enter = event.keyCode === 13;
      const tab = event.keyCode === 9;

      if (
        b ||
        i ||
        h ||
        z ||
        zz ||
        backspace ||
        l ||
        s ||
        p ||
        u ||
        uu ||
        y ||
        a ||
        ii ||
        e ||
        k
      ) {
        event.preventDefault();
      }

      // hvis tekstinput er mellomrom eller enter, lagres inputText til undo:
      if (spacebar) {
        undo = [...undo, inputText];
        undoCursorPosition.push(cursorPositionStart);
      }

      // når bruker trykker "enter" skal noen funksjoner ha egen oppførsel.
      // som feks ny linje.
      if (enter) {
        charCounter = 0;
        undo = [...undo, inputText];
        undoCursorPosition.push(cursorPositionStart);
        if (buttonBoolValues[listButtonValues["bTitle"]] === false) {
          if (
            inputText.slice(
              cursorPositionStart - listButtonValues["cursorInt"],
              cursorPositionStart
            ) === listButtonValues["output"]
          ) {
            buttonBoolValues[listButtonValues["bTitle"]] = true;
            this.setState({ boolButton: buttonBoolValues });
            inputText =
              inputText.slice(
                0,
                cursorPositionStart - listButtonValues["cursorInt"]
              ) + inputText.slice(cursorPositionStart);
            this.setState({ textValue: inputText });
            this.setState({ mdValue: mdParser(inputText) });
            setCursorPosition(
              cursorPositionStart - listButtonValues["cursorInt"],
              cursorPositionStart - listButtonValues["cursorInt"]
            );
            return;
          }
          inputText =
            inputText.slice(0, cursorPositionStart) +
            "\n\n" +
            listButtonValues["output"] +
            inputText.slice(cursorPositionStart);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          setCursorPosition(
            cursorPositionStart + listButtonValues["cursorInt"] + 2,
            cursorPositionStart + listButtonValues["cursorInt"] + 2
          );
          return;
        }
        if (!buttonBoolValues["heading"]) {
          buttonBoolValues["heading"] = true;
        }
      }

      // tab skal gi to mellomrom indentering.  Også i kodeblokk.
      if (tab) {
        event.preventDefault();
        // config for correct tab inside codeblock:
        if (!buttonBoolValues["codeblock"]) {
          undo = [...undo, inputText];
          undoCursorPosition.push(cursorPositionStart);
          inputText =
            inputText.slice(0, cursorPositionStart) +
            "  " +
            inputText.slice(cursorPositionStart);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart += 2;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        }
        undo = [...undo, inputText];
        undoCursorPosition.push(cursorPositionStart);
        inputText =
          inputText.slice(0, cursorPositionStart) +
          "  " +
          inputText.slice(cursorPositionEnd);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
      }

      // kanselerer knappetrykk med piltaster
      if (leftArrow || upArrow || rightArrow || downArrow) {
        resetButtonOnOff();
      }
    };

    // Vise, skjule image-button-popup
    const imagePopupSubmitHandler = imagePopupInputValue => {
      if (imagePopupInputValue !== "") {
        undo = [...undo, inputText];
        undoCursorPosition.push(cursorPositionStart);
        inputText =
          inputText.slice(0, cursorPositionStart) +
          "![Bildebeskrivelse her](" +
          imagePopupInputValue +
          ")" +
          inputText.slice(cursorPositionStart);
        this.setState({ textValue: inputText });
        this.editorRef.current.focus();
        cursorPositionStart += 2;
        cursorPositionEnd += 22;
        setCursorPosition(cursorPositionStart, cursorPositionEnd);
        imagePopup = <br />;
      } else {
        imagePopup = <br />;
        this.editorRef.current.focus();
        setCursorPosition(cursorPositionStart, cursorPositionEnd);
      }
    };

    // litt logikk for å detektere linjeskift ++
    const ifNewLine = () => {
      return inputText[cursorPositionStart - 1] === "\n" ||
        inputText === "" ||
        cursorPositionStart === 0 ||
        inputText.slice(cursorPositionStart - 3, cursorPositionStart) ===
          "## " ||
        inputText.slice(cursorPositionStart - 2, cursorPositionStart) === "# "
        ? true
        : false;
    };

    // funksjon som konfigurerer hva som skjer når man trykker på knapper i teksteditor
    // hurtigtast-trykk sendes også til denne funksjonen
    const handleButtonClick = (
      bTitle,
      output,
      cursorIntON,
      cursorIntOFF,
      endOutput
    ) => {
      // flytte fokus til tekstvindu etter button-click
      this.editorRef.current.focus();
      setCursorPosition(cursorPositionStart, cursorPositionStart);

      // fjerner all tekst i editor og undo/redo-variablene
      if (bTitle === "new") {
        inputText = "";
        undo = [""];
        redo = [];
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        cursorPositionStart = cursorPositionEnd = 0;
        return;
      }

      // Load, save, undo, redo funksjoner
      if (bTitle === "load") {
        inputText = storedTextValue;
        undo = [inputText];
        redo = [inputText];
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        setCursorPosition(inputText.length, inputText.length);
        return;
      }

      if (bTitle === "save") {
        storedTextValue = inputText;
        return;
      }

      if (bTitle === "undo") {
        let pos1 = undoCursorPosition.pop();
        let pos2 = pos1;
        if (undo.length <= 0) {
          return;
        }
        redo = [...redo, inputText];
        redoCursorPosition.push(cursorPositionStart);
        inputText = undo.pop();
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        setCursorPosition(pos1, pos2);
        return;
      }

      if (bTitle === "redo") {
        let pos1 = redoCursorPosition.pop();
        let pos2 = pos1;
        if (redo.length <= 0) {
          return;
        }
        undo = [...undo, inputText];
        undoCursorPosition.push(cursorPositionStart);
        inputText = redo.pop();
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        setCursorPosition(pos1, pos2);
        return;
      }

      // nuller ut verdi fra knapp-trykk om man trykker en gang til på knapp uten å ha skrevet noen tegn.
      // kanselerer da ut første knappetrykket.
      if (
        !buttonBoolValues[bTitle] &&
        inputText.slice(
          cursorPositionStart - cursorIntON,
          cursorPositionStart - cursorIntON + output.length
        ) === output
      ) {
        buttonBoolValues[bTitle] = true;
        this.setState({ boolButton: buttonBoolValues });
        undo = [...undo, inputText];
        undoCursorPosition.push(cursorPositionStart);
        inputText =
          inputText.slice(0, cursorPositionStart - cursorIntON) +
          inputText.slice(cursorPositionStart - cursorIntON + output.length);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        cursorPositionEnd = cursorPositionStart -= cursorIntON;
        setCursorPosition(cursorPositionStart, cursorPositionStart);
        return;
      }

      // gir linjeskift for enkelte knapper - om knapp trykkes og det ikke allerede er ny linje
      if (
        bTitle.slice(0, 4) === "list" ||
        (bTitle === "codeblock" && buttonBoolValues["codeblock"]) ||
        (bTitle === "heading" && buttonBoolValues["heading"])
      ) {
        if (!ifNewLine()) {
          inputText =
            inputText.slice(0, cursorPositionStart) +
            "\n\n" +
            inputText.slice(cursorPositionStart);
          this.setState({ textValue: inputText });
          cursorPositionStart += 2;
          cursorPositionEnd += 2;
          handleButtonClick(
            bTitle,
            output,
            cursorIntON,
            cursorIntOFF,
            endOutput
          );
          return;
        }
        if (bTitle.slice(0, 4) === "list") {
          listButtonValues = {
            bTitle: bTitle,
            output: output,
            cursorInt: cursorIntON
          };
        }
      }

      // hvis opplasting av bilde-knapp trykkes:
      if (bTitle === "image") {
        imagePopup = (
          <ImagePopup imagePopupSubmitHandler={imagePopupSubmitHandler} />
        );
        return;
      }

      // Config for å gi "heading" flere verdier på en knapp
      if (ifNewLine()) {
        if (
          output === "## " &&
          inputText.slice(cursorPositionStart - 3, cursorPositionStart) ===
            output &&
          buttonBoolValues[bTitle]
        ) {
          buttonBoolValues[bTitle] = false;
          this.setState({ boolButton: buttonBoolValues });
          undo = [...undo, inputText];
          undoCursorPosition.push(cursorPositionStart);
          inputText =
            inputText.slice(0, cursorPositionStart - 3) +
            "# " +
            inputText.slice(cursorPositionStart);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart -= 1;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        } else if (output === "## " && buttonBoolValues[bTitle]) {
          undo = [...undo, inputText];
          undoCursorPosition.push(cursorPositionStart);
          inputText =
            inputText.slice(0, cursorPositionStart) +
            output +
            inputText.slice(cursorPositionStart);

          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart += output.length;
          setCursorPosition(cursorPositionStart, cursorPositionStart);
          return;
        } else if (output === "## " && !buttonBoolValues[bTitle]) {
          if (
            inputText.slice(cursorPositionStart - 2, cursorPositionStart) ===
            "# "
          ) {
            undo = [...undo, inputText];
            undoCursorPosition.push(cursorPositionStart);
            inputText =
              inputText.slice(0, cursorPositionStart - 2) +
              inputText.slice(cursorPositionStart);
            this.setState({ textValue: inputText });
            this.setState({ mdValue: mdParser(inputText) });
            cursorPositionStart -= 2;
            setCursorPosition(cursorPositionStart, cursorPositionStart);
            buttonBoolValues[bTitle] = true;
            this.setState({ boolButton: buttonBoolValues });
            return;
          } else {
            buttonBoolValues[bTitle] = true;
            this.setState({ boolButton: buttonBoolValues });
            return;
          }
        }
      }

      //constraint button from working if new line or not end of line.
      if (output[0] === "{" && buttonBoolValues[bTitle]) {
        if (ifNewLine()) {
          return;
        }
        if (inputText[cursorPositionEnd] !== undefined) {
          if (inputText[cursorPositionEnd] !== "\n") {
            return;
          }
        }
      }

      //  Konfig av knapper slik at de registrerer om de er trykket, og flytter tekst-markøren i henhold til hvordan MD-syntax ser ut
      // Konfig-data finnes i ./buttonConfig.js der tallverdi for hvor mye tekst-markøren skal flyttes er definert in "cursorIntON" og "cursorIntOFF"
      if (buttonBoolValues[bTitle]) {
        if (cursorPositionStart !== cursorPositionEnd) {
          buttonBoolValues[bTitle] = false;
          this.setState({ boolButton: buttonBoolValues });
          let i = inputText.slice(cursorPositionStart, cursorPositionEnd);
          while (
            i[0] === " " ||
            i[i.length - 1] === " " ||
            i[0] === "\n" ||
            i[i.length - 1] === "\n"
          ) {
            if (i[0] === " " || i[0] === "\n") {
              i = i.slice(1);
              cursorPositionStart += 1;
            }
            if (i[i.length - 1] === " " || i[i.length - 1] === "\n") {
              i = i.slice(0, i.length - 1);
              cursorPositionEnd -= 1;
            }
          }
          setCursorPosition(cursorPositionStart, cursorPositionEnd);
          undo = [...undo, inputText];
          undoCursorPosition.push(cursorPositionStart);
          inputText =
            inputText.slice(0, cursorPositionStart) +
            output.slice(0, cursorIntON) +
            i +
            output.slice(cursorIntON) +
            inputText.slice(cursorPositionEnd);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          setCursorPosition(
            cursorPositionStart + cursorIntON,
            cursorPositionEnd + cursorIntON
          );
          return;
        }
        buttonBoolValues[bTitle] = false;
        this.setState({ boolButton: buttonBoolValues });
        undo = [...undo, inputText];
        undoCursorPosition.push(cursorPositionStart);
        inputText =
          inputText.slice(0, cursorPositionStart) +
          output +
          inputText.slice(cursorPositionStart);
        this.setState({ textValue: inputText });
        this.setState({ mdValue: mdParser(inputText) });
        setCursorPosition(
          cursorPositionStart + cursorIntON,
          cursorPositionStart + cursorIntON
        );
        return;
      } else if (!buttonBoolValues[bTitle]) {
        if (cursorPositionStart !== cursorPositionEnd) {
          buttonBoolValues[bTitle] = true;
          this.setState({ boolButton: buttonBoolValues });
          inputText = undo[undo.length - 1];
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          setCursorPosition(
            cursorPositionStart - cursorIntON,
            cursorPositionEnd - cursorIntON
          );
          return;
        }
        buttonBoolValues[bTitle] = true;
        this.setState({ boolButton: buttonBoolValues });
        setCursorPosition(
          cursorPositionStart + cursorIntOFF,
          cursorPositionEnd + cursorIntOFF
        );
        if (endOutput) {
          undo = [...undo, inputText];
          undoCursorPosition.push(cursorPositionStart);
          inputText =
            inputText.slice(0, cursorPositionStart + cursorIntOFF) +
            endOutput +
            inputText.slice(cursorPositionStart + cursorIntOFF);
          this.setState({ textValue: inputText });
          this.setState({ mdValue: mdParser(inputText) });
          cursorPositionStart = cursorPositionEnd += cursorIntOFF;
          setCursorPosition(cursorPositionStart, cursorPositionEnd);
        }
        return;
      } else {
        return;
      }
    };

    // Kode for å lage snarveier på tastatur.
    const keyMap = {
      BOLD: SHORTCUTKEY + "+b",
      ITALIC: SHORTCUTKEY + "+i",
      HEADING: SHORTCUTKEY + "+h",
      STRIKETHROUGH: SHORTCUTKEY + "+s",
      UNDO: SHORTCUTKEY + "+z",
      REDO: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+z",
      NEW: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+backspace",
      LOAD: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+l",
      SAVE: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+s",
      IMAGE: SHORTCUTKEY + "+p",
      LISTUL: SHORTCUTKEY + "+u",
      LISTOL: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+u",
      CHECKLIST: SHORTCUTKEY + "+y",
      ACTIVITY: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+a",
      INTRO: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+i",
      CHECK: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+c",
      PROTIP: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+p",
      CHALLENGE: SHORTCUTKEY + "+" + SHORTCUTKEY2 + "+g",
      INLINE: SHORTCUTKEY + "+e",
      CODEBLOCK: SHORTCUTKEY + "+k"
    };

    // Hva som skjer når man trykker en hurtigtastetrykk.
    // kaller samme funksjon som når man trykker på tilsvarende knapper med tilsvarende verdier (finnes i buttonConfig.js)
    const handlers = {
      BOLD: () => handleButtonClick("bold", "****", 2, 2, ""),
      ITALIC: () => handleButtonClick("italic", "**", 1, 1, ""),
      HEADING: () => handleButtonClick("heading", "## ", 0, 0, ""),
      STRIKETHROUGH: () => handleButtonClick("strikethrough", "~~~~", 2, 2, ""),
      UNDO: () => handleButtonClick("undo", "", 0, 0, ""),
      REDO: () => handleButtonClick("redo", "", 0, 0, ""),
      NEW: () => handleButtonClick("new", "", 0, 0, ""),
      LOAD: () => handleButtonClick("load", "", 0, 0, ""),
      SAVE: () => handleButtonClick("save", "", 0, 0, ""),
      IMAGE: () => handleButtonClick("image", "", 0, 0, ""),
      LISTUL: () => handleButtonClick("listUl", "- ", 2, 0, ""),
      LISTOL: () => handleButtonClick("listOl", "1. ", 3, 0, ""),
      CHECKLIST: () => handleButtonClick("listCheck", "- [ ] ", 6, 0, ""),
      ACTIVITY: () => handleButtonClick("activity", "{.activity}", 11, 11, ""),
      INTRO: () => handleButtonClick("intro", "{.intro}", 8, 8, ""),
      CHECK: () => handleButtonClick("check", "{.check}", 8, 8, ""),
      PROTIP: () => handleButtonClick("protip", "{.protip}", 9, 9, ""),
      CHALLENGE: () =>
        handleButtonClick("challenge", "{.challenge}", 12, 12, ""),
      INLINE: () => handleButtonClick("inline", "``", 1, 1, ""),
      CODEBLOCK: () =>
        handleButtonClick("codeblock", `${temp}\n\n${temp}`, 4, 5, "\n")
    };

    return (
      <div className="Editor">
        <div className="controlPanelPlacement">
          <ControlPanel handleButtonClick={handleButtonClick} />
          <div className="ui two column test grid container">
            <div className="column">
              <MDTextArea
                editorRef={this.editorRef}
                textValue={this.state.textValue}
                onInputChange={handleChange}
                handleButtonClick={handleButtonClick}
                onTextareaKeyDown={onTextareaKeyDown}
                onTextareaKeyUp={onTextareaKeyUp}
                onTextareaMouseDown={onTextareaMouseDown}
                onTextareaSelect={onTextareaSelect}
                handlers={handlers}
                keyMap={keyMap}
              />
            </div>
            {imagePopup}
            <div className="column">
              <MDPreview mdValue={this.state.mdValue} />
            </div>
          </div>
        </div>
        <div className="ui autosave container">
          <div className="autosave">
            <p style={{ color: "grey" }}>{autoSaveMessage}</p>
          </div>
        </div>
        <div className="ui container">
          <PageButtons
            prevTitle="Tilbake"
            nextTitle="Submit"
            prevValue="/createNewLesson"
            nextValue="/endpage"
            mySubmitHandler={mySubmitHandler}
          />
        </div>
      </div>
    );
  }
}

export default Editor;
