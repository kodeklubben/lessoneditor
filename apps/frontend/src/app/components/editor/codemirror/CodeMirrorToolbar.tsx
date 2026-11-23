import "../buttonpanel/buttonpanel.scss";
import "../buttonpanel/buttonpanel_smalldevices.scss";
import { Dispatch, FC, SetStateAction } from "react";
import { EditorView } from "@codemirror/view";
import { StateCommand } from "@codemirror/state";
import { redo, undo } from "@codemirror/commands";
import { RenderButtons } from "../buttonpanel/buttoncontroller/views/RenderButtons";
import { RenderCodeButtons } from "../buttonpanel/buttoncontroller/views/RenderCodeButtons";
import { RenderMicroScratchButtons } from "../buttonpanel/buttoncontroller/views/RenderMicroScratchButtons";
import {
  codebuttons,
  emphasis,
  hyperlink,
  lists,
  media,
  preview as previewConfig,
  undoRedo,
} from "../buttonpanel/buttoncontroller/settings/buttonConfig";
import EditorDatamodal from "../datapanel/EditorDatamodal";
import SubmitButton from "../buttonpanel/SubmitButton";
import SaveStatus from "../SaveStatus";
import { AutosaveStatus } from "../../../utils/autosave";
import { codeBlockLanguage, coloursForCourse, SECTIONS } from "./lessonSyntax";
import {
  InlineKind,
  ListKind,
  toggleBlockColour,
  toggleCodeBlock,
  toggleInline,
  toggleList,
  toggleSection,
} from "./commands";
import { EditorActions } from "./setup";

export interface ToolbarState {
  active: Record<string, boolean>;
  inCodeBlock: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

interface Props {
  view: () => EditorView | null;
  toolbar: ToolbarState;
  /** «Tekst her» in the text's own language. */
  text: string;
  actions: EditorActions;
  course: string;
  courseTitle: string;
  lessonTitle: string;
  mdText: string;
  openSettings: boolean;
  setOpenSettings: Dispatch<SetStateAction<boolean>>;
  isDesktop: boolean;
  saveStatus: AutosaveStatus;
  flushAutosave: () => Promise<boolean>;
  setPreview: Dispatch<SetStateAction<boolean>>;
  /** On a phone or tablet the text buttons sit below the text, as in the classic editor. */
  part?: "top" | "bottom";
}

/**
 * The editor's buttons, as the classic editor has them, but each one runs a CodeMirror command:
 * the button is pressed when the cursor stands in its markup (read from the syntax tree), and a
 * second press takes the markup away. The shortcuts are CodeMirror key bindings (setup.ts).
 */
const CodeMirrorToolbar: FC<Props> = ({
  view,
  toolbar,
  text,
  actions,
  course,
  courseTitle,
  lessonTitle,
  mdText,
  openSettings,
  setOpenSettings,
  isDesktop,
  saveStatus,
  flushAutosave,
  setPreview,
  part = "top",
}) => {
  const { active, inCodeBlock } = toolbar;

  const exec = (command: StateCommand | ((view: EditorView) => boolean)) => {
    const editor = view();
    if (!editor) return;
    command(editor);
    editor.focus();
  };

  const emphasisButtons = (
    <div className="emphasis_button_group">
      {Object.values(emphasis).map((button) => (
        <RenderButtons
          key={button.slug}
          isON={!!active[button.slug]}
          icon={button.icon}
          title={button.title}
          buttonSlug={button.slug}
          shortcutKey={button.shortcut}
          handleButtonClick={() => exec(toggleInline(button.slug as InlineKind, text))}
        />
      ))}
    </div>
  );

  const undoRedoButtons = (
    <div className="undo-redo_button_group">
      <RenderButtons
        isON={false}
        icon={undoRedo.undo.icon}
        title={undoRedo.undo.title}
        buttonSlug={undoRedo.undo.slug}
        shortcutKey={undoRedo.undo.shortcut}
        disabled={!toolbar.canUndo}
        handleButtonClick={() => exec(undo)}
      />
      <RenderButtons
        isON={false}
        icon={undoRedo.redo.icon}
        title={undoRedo.redo.title}
        buttonSlug={undoRedo.redo.slug}
        shortcutKey={undoRedo.redo.shortcut}
        disabled={!toolbar.canRedo}
        handleButtonClick={() => exec(redo)}
      />
    </div>
  );

  const mediaButtons = (
    <>
      <div className="hyperlink_button_group">
        <RenderButtons
          isON={false}
          icon={hyperlink.hyperlink.icon}
          title={hyperlink.hyperlink.title}
          buttonSlug={hyperlink.hyperlink.slug}
          shortcutKey={hyperlink.hyperlink.shortcut}
          handleButtonClick={actions.openLink}
        />
      </div>
      <div className="image_button_group">
        <RenderButtons
          isON={false}
          icon={media.image.icon}
          title={media.image.title}
          buttonSlug={media.image.slug}
          shortcutKey={media.image.shortcut}
          handleButtonClick={actions.openImage}
        />
      </div>
      <div className="video_button_group">
        <RenderButtons
          isON={false}
          icon={media.video.icon}
          title={media.video.title}
          buttonSlug={media.video.slug}
          shortcutKey={media.video.shortcut}
          handleButtonClick={actions.openVideo}
        />
      </div>
    </>
  );

  const listButtons = (
    <div className="lists_button_group">
      {Object.values(lists).map((button) => (
        <RenderButtons
          key={button.slug}
          isON={!!active[button.slug]}
          icon={button.icon}
          title={button.title}
          buttonSlug={button.slug}
          shortcutKey={button.shortcut}
          handleButtonClick={() => exec(toggleList(button.slug as ListKind, text))}
        />
      ))}
    </div>
  );

  const sectionButtons = SECTIONS.map((section) => (
    <RenderButtons
      key={section.slug}
      isON={!!active[section.slug]}
      icon=""
      title={section.title}
      buttonSlug={section.slug}
      shortcutKey={section.shortcut}
      style={section.style}
      imageurl={section.imageurl ?? ""}
      handleButtonClick={() => exec(toggleSection(section.cls, section.level, text))}
    />
  ));

  const codeButtons = (
    <>
      <RenderCodeButtons
        isON={!!active.inline}
        title={codebuttons.inline.title}
        buttonSlug={codebuttons.inline.slug}
        shortcutKey={codebuttons.inline.shortcut}
        style={codebuttons.inline.style}
        courseTitle={courseTitle}
        handleButtonClick={() => exec(toggleInline("inline", text))}
      />
      <RenderCodeButtons
        isON={!!active.codeblock}
        title={codebuttons.codeblock.title}
        buttonSlug={codebuttons.codeblock.slug}
        shortcutKey={codebuttons.codeblock.shortcut}
        style={codebuttons.codeblock.style}
        courseTitle={courseTitle}
        handleButtonClick={() => exec(toggleCodeBlock(codeBlockLanguage(course), text))}
      />
    </>
  );

  const colourButtons = coloursForCourse(course).map((colour) => (
    <RenderMicroScratchButtons
      key={colour.slug}
      isON={!!active[colour.slug]}
      title={colour.title}
      buttonSlug={colour.slug}
      shortcutKey={colour.shortcut}
      color={colour.color}
      disabled={inCodeBlock}
      handleButtonClick={() => exec(toggleBlockColour(colour.cls, text))}
    />
  ));

  const settings = (
    <div className="settingspanel">
      <EditorDatamodal
        courseTitle={courseTitle}
        lessonTitle={lessonTitle}
        openSettings={openSettings}
        setOpenSettings={setOpenSettings}
      />
      <SubmitButton mdText={mdText} flushAutosave={flushAutosave} />
    </div>
  );

  if (!isDesktop && part === "top") {
    return (
      <div className="buttonpanel">
        <div className="top_panel">
          <div className="firstrow_mobile">
            {undoRedoButtons}
            {settings}
            <SaveStatus status={saveStatus} />
          </div>
        </div>
      </div>
    );
  }

  if (part === "bottom") {
    if (isDesktop) return null;
    return (
      <>
        <div className="buttonpanel_small_devices cm-small-toolbar">
          <div className="bottom_panel">
            {colourButtons.length > 0 && (
              <div className="scratchmicrobit_row active">{colourButtons}</div>
            )}
            <div className="codebuttons_row">
              {sectionButtons}
              {codeButtons}
            </div>
            <div className="textbuttons_row">
              {emphasisButtons}
              <div className="preview_button_group">
                <RenderButtons
                  isON={false}
                  icon={previewConfig.preview.icon}
                  title={previewConfig.preview.title}
                  buttonSlug={previewConfig.preview.slug}
                  shortcutKey={previewConfig.preview.shortcut}
                  handleButtonClick={() => setPreview((shown) => !shown)}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="buttonpanel">
      <div className="top_panel">
        <div className="firstrow">
          <div className="buttongroup">
            {emphasisButtons}
            <div style={{ marginRight: "3rem" }} />
            {undoRedoButtons}
            <div style={{ marginRight: "3rem" }} />
            {mediaButtons}
            <div style={{ marginRight: "3rem" }} />
            {listButtons}
          </div>
          {settings}
        </div>
        <div className="secondrow">
          <div className="sectiongroup">
            {sectionButtons}
            <span style={{ marginRight: "5em" }} />
            {codeButtons}
          </div>
          <SaveStatus status={saveStatus} />
        </div>
        <div className="scratchmicrobit_row">{colourButtons}</div>
      </div>
    </div>
  );
};

export default CodeMirrorToolbar;
