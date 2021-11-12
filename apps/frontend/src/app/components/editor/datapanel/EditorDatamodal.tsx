import "./editordatamodal.scss";
import { Dispatch, SetStateAction, SyntheticEvent, FC } from "react";
import { useHistory, useParams, useLocation } from "react-router";
import { Button, Header, Input, Modal, Popup } from "semantic-ui-react";
import MultiInput from "./MultiInput";
import { FORM_TEXT } from "./settings/landingpage_NO";
import { useFileContext } from "../../../contexts/FileContext";
import { filenameParser } from "../../../utils/filename-parser";

interface EditorDatamodalProps {
  courseTitle: string;
  lessonTitle: string;
  setShowSpinner: Dispatch<SetStateAction<boolean>>;
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
}

const EditorDatamodal: FC<EditorDatamodalProps> = ({
  courseTitle,
  lessonTitle,
  setShowSpinner,
  openSettings,
  setOpenSettings,
}) => {
  const history = useHistory();
  const location = useLocation();
  const { lessonId, file } = useParams<{ lessonId: string; file: string }>();
  const { state, saveFileHeader, setFileContextState } = useFileContext();

  const { language, languageName } = filenameParser(file);

  const changeHandler = (event: SyntheticEvent, data: Record<string, string>) => {
    const { name, value } = data;

    if (setFileContextState) {
      setFileContextState((s) => {
        return {
          ...s,
          headerData: {
            ...s.headerData,
            [name]: value,
          },
        };
      });
      if (state.headerData.author && state.headerData.title) {
        setFileContextState((s) => {
          return {
            ...s,
            headerData: {
              ...s.headerData,
              err: "",
            },
          };
        });
      }
    }
  };

  const onSubmit = async () => {
    if (saveFileHeader) {
      setShowSpinner(true);
      await saveFileHeader(state.headerData);
      setShowSpinner(false);
      setOpenSettings(false);
      console.log({ file });
      console.log({ lessonId });
      history.push(location.pathname);
    }
  };

  const onCancel = async () => {
    if (saveFileHeader && state.headerData) {
      await saveFileHeader({ ...state.headerData });
      setOpenSettings(false);
    }
  };

  return (
    <>
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
            onClick={() => setOpenSettings(true)}
          />
        }
      />
      <Modal
        closeOnDimmerClick={
          !(
            !state.headerData?.title ||
            (!state.headerData?.author && state.headerData.authorList.length === 0)
          )
        }
        onClose={() => setOpenSettings(false)}
        onOpen={() => setOpenSettings(true)}
        open={openSettings}
        size="large"
        closeIcon={
          !(
            !state.headerData?.title ||
            (!state.headerData?.author && state.headerData.authorList.length === 0)
          )
        }
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
            value={state.headerData.title}
            onChange={changeHandler}
            fluid
          />
          {!state.headerData.title ? (
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
            inputArray={state.headerData.authorList}
            inputValue={state.headerData.author}
            name="author"
            placeholder={FORM_TEXT.AUTHOR.placeholder}
            required="(obligatorisk)"
            title={FORM_TEXT.AUTHOR.heading}
          />
          {state.headerData?.authorList.length === 0 && !state.headerData?.author ? (
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
            inputArray={state.headerData.translatorList}
            inputValue={state.headerData?.translator}
            name="translator"
            placeholder={FORM_TEXT.TRANSLATOR.placeholder}
            required=""
            title={FORM_TEXT.TRANSLATOR.heading}
          />
        </Modal.Content>

        <Modal.Actions className="editor_modal">
          <Button
            disabled={
              !state.headerData?.title ||
              (!state.headerData.author && state.headerData.authorList.length === 0)
            }
            color={
              state.headerData?.title &&
              (state.headerData.author || state.headerData.authorList.length > 0)
                ? "black"
                : "grey"
            }
            onClick={onCancel}
            content="Avbryt"
          />
          <Button
            disabled={
              !state.headerData?.title ||
              (!state.headerData.author && state.headerData.authorList.length === 0)
            }
            onClick={onSubmit}
            content="OK"
            positive
            labelPosition="right"
            icon="checkmark"
          />
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default EditorDatamodal;
