import "./editordatamodal.scss";
import { Dispatch, SetStateAction, SyntheticEvent, useState, FC } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Header, Input, Modal, Popup } from "semantic-ui-react";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO";
import { useFileContext } from "../../../contexts/FileContext";
import { filenameParser } from "../../../utils/filename-parser";

interface EditorDatamodalProps {
  courseTitle: string;
  lessonTitle: string;
  setShowSpinner: Dispatch<SetStateAction<boolean>>;
}

const EditorDatamodal: FC<EditorDatamodalProps> = ({
  courseTitle,
  lessonTitle,
  setShowSpinner,
}) => {
  const history = useHistory();
  const { lessonId, file } = useParams<any>();
  const { headerData, saveFileHeader, setHeaderData } = useFileContext();
  const [open, setOpen] = useState<boolean>(false);

  const { language, languageName } = filenameParser(file);

  const changeHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    const { name, value } = data;
    if (setHeaderData) {
      setHeaderData((prevState) => ({ ...prevState, [name]: value }));
      if (headerData?.author) {
        setHeaderData((prevState) => ({ ...prevState, err: "" }));
      }
      if (headerData?.title) {
        setHeaderData((prevState) => ({ ...prevState, err: "" }));
      }
    }
  };

  const onSubmit = async () => {
    if (saveFileHeader) {
      const newHeaderData = Object.assign({ language }, headerData);
      setShowSpinner(true);
      await saveFileHeader(lessonId, file, newHeaderData);
      setShowSpinner(false);
      setOpen(false);
      history.push("/");
      history.replace(["editor", lessonId, file].join("/"));
    }
  };

  const onCancel = async () => {
    if (setHeaderData && headerData) {
      setHeaderData(headerData);
      setOpen(false);
    }
  };

  return (
    <div>
      <Popup
        content={"Endre data for oppgavetekst"}
        mouseEnterDelay={250}
        mouseLeaveDelay={250}
        trigger={
          <Button
            basic
            style={{ height: "2em", padding: "0 1em 0 1em", margin: "0" }}
            id="next"
            size="big"
            icon="address card"
            content="Oppgavedata"
            onClick={() => setOpen(true)}
          />
        }
      />
      <Modal
        closeOnDimmerClick={
          !(!headerData?.title || (!headerData?.author && headerData.authorList.length === 0))
        }
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        size="large"
        dimmer="inverted"
        className="editor_modal"
      >
        <Modal.Header className="editor_modal">
          <Header as="h1">
            <span style={{ color: "grey", marginRight: "1ch" }}>{`Prosjekttittel: `}</span>
            {lessonTitle}
            <Header.Subheader>{`Kurs: ${courseTitle}`}</Header.Subheader>
          </Header>
        </Modal.Header>
        <Modal.Content className="editor_modal">
          <Header as="h3" className="formLabel">
            {`${FORM_TEXT.TITLE.heading} på ${languageName}`}
            <span className="labelTextSpan">(obligatorisk)</span>
          </Header>

          <Input
            autoFocus
            autoComplete="off"
            type="text"
            name="title"
            placeholder={FORM_TEXT.TITLE.placeholder}
            value={headerData?.title}
            onChange={changeHandler}
            fluid
          />
          {!headerData?.title ? (
            <p style={{ color: "red" }}>
              <i>Må ha tittel</i>
            </p>
          ) : (
            <p style={{ height: "1.35em" }}></p>
          )}
        </Modal.Content>
        <Modal.Content className="editor_modal">
          <MultiInput
            changeHandler={changeHandler}
            //@ts-ignore
            inputArray={headerData!.authorList}
            //@ts-ignore
            inputValue={headerData.author}
            name="author"
            placeholder={FORM_TEXT.AUTHOR.placeholder}
            required="(obligatorisk)"
            title={FORM_TEXT.AUTHOR.heading}
          />
          {headerData?.authorList.length === 0 && !headerData?.author ? (
            <p>
              <i style={{ color: "red" }}>Må ha forfatter</i>
            </p>
          ) : (
            <p style={{ height: "1.35em" }}></p>
          )}
        </Modal.Content>
        <Modal.Content className="editor_modal">
          <MultiInput
            changeHandler={changeHandler}
            //@ts-ignore
            inputArray={headerData?.translatorList}
            //@ts-ignore
            inputValue={headerData?.translator}
            name="translator"
            placeholder={FORM_TEXT.TRANSLATOR.placeholder}
            title={FORM_TEXT.TRANSLATOR.heading}
          />
        </Modal.Content>

        <Modal.Actions className="editor_modal">
          <Button
            disabled={
              !headerData?.title || (!headerData.author && headerData.authorList.length === 0)
            }
            color={
              headerData?.title && (headerData.author || headerData.authorList.length > 0)
                ? "black"
                : "grey"
            }
            onClick={onCancel}
            content="Avbryt"
          />
          <Button
            disabled={
              !headerData?.title || (!headerData.author && headerData.authorList.length === 0)
            }
            onClick={onSubmit}
            content="OK"
            positive
            labelPosition="right"
            icon="checkmark"
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default EditorDatamodal;
