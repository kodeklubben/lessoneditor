import "../../../pages/editor.scss";
import "./codemirror.scss";
import axios from "axios";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Button, Header, Modal } from "semantic-ui-react";
import { EditorState } from "@codemirror/state";
import { EditorView, ViewUpdate } from "@codemirror/view";
import { redoDepth, undoDepth } from "@codemirror/commands";
import { paths } from "@lessoneditor/contracts";
import { useLessonContext } from "../../../contexts/LessonContext";
import { useFileContext } from "../../../contexts/FileContext";
import { DESKTOP_EDITOR, useMediaQuery } from "../../../utils/useMediaQuery";
import Navbar from "../../navbar/Navbar";
import ShowSpinner from "../../ShowSpinner";
import MDPreviewArea from "../MDPreviewArea";
import MachineTranslationNotice from "../MachineTranslationNotice";
import SaveProblemModal from "../SaveProblemModal";
import { useAutosave } from "../useAutosave";
import { placeholderText } from "../settingsFiles/languages/editor_NO";
import { activeButtons, insertImage, insertLink, insertVideo } from "./commands";
import { EditorActions, lessonEditorExtensions } from "./setup";
import CodeMirrorToolbar, { ToolbarState } from "./CodeMirrorToolbar";
import { LinkDialog, VideoDialog } from "./InsertDialogs";
import { syncPreview } from "./scrollSync";
import { uploadLessonImage } from "./uploadImage";

const LINK_TEXT = "lenkebeskrivelse";

const toolbarFor = (state: EditorState): ToolbarState => ({
  ...activeButtons(state),
  canUndo: undoDepth(state) > 0,
  canRedo: redoDepth(state) > 0,
});

/**
 * The editor page, with CodeMirror (the classic textarea editor is soft-deleted, ?editor=classic). The lesson
 * around it is the same as in the classic editor: the same preview with the lesson page's CSS, the
 * same autosave, conflict dialog, lesson data and submit button.
 */
const CodeMirrorEditor: FC = () => {
  const { lang, lessonId } = useParams() as { lang: string; lessonId: string };
  const location = useLocation();
  const { state, setImages } = useLessonContext();
  const { savedFileBody, state: fileState } = useFileContext();
  const isDesktop = useMediaQuery(DESKTOP_EDITOR);
  const text = placeholderText(lang);

  const [mdText, setMdText] = useState("");
  const [toolbar, setToolbar] = useState<ToolbarState>({
    active: {},
    inCodeBlock: false,
    canUndo: false,
    canRedo: false,
  });
  const [openSettings, setOpenSettings] = useState(false);
  const [preview, setPreview] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const autosave = useAutosave(mdText, savedFileBody);
  const viewRef = useRef<EditorView | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const course = state.lesson?.courseSlug;

  useEffect(() => {
    if (lessonId)
      axios.post(paths.LESSON_WARMUP.replace(":lessonId", String(lessonId))).catch(() => undefined);
  }, [lessonId]);

  useEffect(() => {
    if (new URLSearchParams(location.search).has("init")) setOpenSettings(true);
  }, [location.search]);

  const uploadImages = useCallback(
    async (files: File[]) => {
      setUploading(true);
      try {
        for (const file of files) {
          const { name, url } = await uploadLessonImage(lessonId, file);
          setImages((images: Record<string, string>) => ({ ...images, [name]: url }));
          const view = viewRef.current;
          if (view) view.dispatch(insertImage(view.state, name));
        }
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Bildet ble ikke lastet opp. Prøv igjen.",
        );
      } finally {
        setUploading(false);
        viewRef.current?.focus();
      }
    },
    [lessonId, setImages],
  );

  // The shortcuts in CodeMirror reach the newest dialogs and upload through this ref.
  const actions: EditorActions = {
    openLink: () => setLinkOpen(true),
    openVideo: () => setVideoOpen(true),
    openImage: () => fileInputRef.current?.click(),
    uploadImages: (files) => void uploadImages(files),
  };
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const onUpdate = useCallback((update: ViewUpdate) => {
    if (update.docChanged) setMdText(update.state.doc.toString());
    if (update.docChanged || update.selectionSet || update.transactions.length)
      setToolbar((previous) => {
        const next = toolbarFor(update.state);
        return JSON.stringify(next) === JSON.stringify(previous) ? previous : next;
      });
  }, []);

  const createState = useCallback(
    (doc: string) =>
      EditorState.create({
        doc,
        extensions: lessonEditorExtensions({
          course,
          text,
          language: lang,
          actions: () => actionsRef.current,
          onUpdate,
        }),
      }),
    [course, text, lang, onUpdate],
  );

  /** A new text (loaded, or the other version after a conflict): a fresh state with its own history. */
  const load = useCallback(
    (doc: string) => {
      const view = viewRef.current;
      if (!view) return;
      view.setState(createState(doc));
      setMdText(doc);
      setToolbar(toolbarFor(view.state));
    },
    [createState],
  );

  // The view is made once, when its element appears (the lesson has loaded); later texts come
  // through load().
  const firstText = useRef({ createState, savedFileBody });
  firstText.current = { createState, savedFileBody };
  const hostRef = useCallback((host: HTMLDivElement | null) => {
    if (!host) {
      viewRef.current?.destroy();
      viewRef.current = null;
      return;
    }
    if (viewRef.current) return;
    const { createState, savedFileBody } = firstText.current;
    viewRef.current = new EditorView({ parent: host, state: createState(savedFileBody ?? "") });
    setMdText(savedFileBody ?? "");
    viewRef.current.focus();
  }, []);

  useEffect(() => {
    if (
      typeof savedFileBody === "string" &&
      viewRef.current &&
      viewRef.current.state.doc.toString() !== savedFileBody
    )
      load(savedFileBody);
  }, [savedFileBody, load]);

  // The preview follows the editor's scrolling.
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const previewArea = document.querySelector<HTMLElement>(".editor-windows .preview-area");
        if (previewArea) syncPreview(view, previewArea);
      });
    };
    view.scrollDOM.addEventListener("scroll", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      view.scrollDOM.removeEventListener("scroll", onScroll);
    };
  }, [state.lesson]);

  const withView = (run: (view: EditorView) => void) => {
    const view = viewRef.current;
    if (!view) return;
    run(view);
    view.focus();
  };

  if (!state.lesson) return null;

  const toolbarProps = {
    view: () => viewRef.current,
    toolbar,
    text,
    actions,
    course: state.lesson.courseSlug,
    courseTitle: state.lesson.courseTitle,
    lessonTitle: state.lesson.lessonTitle,
    mdText,
    openSettings,
    setOpenSettings,
    isDesktop,
    saveStatus: autosave.status,
    flushAutosave: autosave.flush,
    setPreview,
  };

  return (
    <>
      {uploading && <ShowSpinner />}
      <input
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
        ref={fileInputRef}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          event.target.value = "";
          if (files.length) void uploadImages(files);
        }}
      />
      <Modal open={!!uploadError} size="tiny" onClose={() => setUploadError("")}>
        <Modal.Content>
          <Header as="h2" size="medium">
            Bildet ble ikke satt inn
          </Header>
          <p>{uploadError}</p>
        </Modal.Content>
        <Modal.Actions>
          <Button positive content="OK" onClick={() => setUploadError("")} />
        </Modal.Actions>
      </Modal>
      <LinkDialog
        open={linkOpen}
        onClose={() => {
          setLinkOpen(false);
          viewRef.current?.focus();
        }}
        onInsert={(url, newTab) =>
          withView((view) => view.dispatch(insertLink(view.state, url, newTab, LINK_TEXT)))
        }
      />
      <VideoDialog
        open={videoOpen}
        onClose={() => {
          setVideoOpen(false);
          viewRef.current?.focus();
        }}
        onInsert={(url) => withView((view) => view.dispatch(insertVideo(view.state, url)))}
      />
      <SaveProblemModal
        problem={
          autosave.status === "conflict" || autosave.status === "missing"
            ? autosave.status
            : undefined
        }
        lessonId={lessonId}
        text={mdText}
        keepMine={autosave.keepMine}
        takeTheirs={async () => load(await autosave.takeTheirs())}
      />
      <Navbar>
        <div>
          <h1 style={{ display: "inline" }}>
            {fileState.headerData?.title?.trim() || state.lesson.lessonTitle}
          </h1>
          <h3 style={{ color: "silver", display: "inline" }}>{state.lesson.courseTitle}</h3>
        </div>
      </Navbar>
      <div className="editor_container cm-editor-page">
        <CodeMirrorToolbar {...toolbarProps} />
        <MachineTranslationNotice />
        <div className="editor-windows">
          <div className="cm-editor-host" ref={hostRef} />
          <MDPreviewArea
            mdText={mdText}
            course={state.lesson.courseSlug}
            language={lang}
            preview={preview}
          />
        </div>
        <CodeMirrorToolbar {...toolbarProps} part="bottom" />
      </div>
    </>
  );
};

export default CodeMirrorEditor;
