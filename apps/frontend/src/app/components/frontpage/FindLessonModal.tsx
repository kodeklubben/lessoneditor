import "./findlesson.scss";
import { FC, useDeferredValue, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button, Dropdown, Icon, Input, Message, Modal } from "semantic-ui-react";
import { CatalogLesson } from "@lessoneditor/contracts";
import { useUserContext } from "../../contexts/UserContext";
import { useCatalog } from "../../utils/useCatalog";
import { useLessonCatalog } from "../../utils/useLessonCatalog";
import { searchLessons } from "../../utils/searchLessons";
import { copyLessonFromRepo, importErrorMessage } from "../../utils/importLesson";
import { languageOption } from "./settings/newLessonOptions";

const RAW = "https://raw.githubusercontent.com/kodeklubben/oppgaver/HEAD/";
const PAGE = 48;

const LEVELS = [
  { value: 1, name: "Introduksjon" },
  { value: 2, name: "Nybegynner" },
  { value: 3, name: "Erfaren" },
  { value: 4, name: "Ekspert" },
];

const levelIcon = (level: number) => `assets/graphics/level-${level}.svg`;

/**
 * «Finn en oppgave»: every lesson on oppgaver.kidsakoder.no, to search and filter, and to copy
 * into the editor with one click (the same copy as the «Rediger oppgave» link on the lesson
 * page). The list is fetched before the dialog opens and kept in the browser, so it opens
 * at once.
 */
const FindLessonModal: FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        basic
        icon="search"
        labelPosition="left"
        content="Finn en oppgave"
        onClick={() => setOpen(true)}
        className="find-lesson-trigger"
      />
      {open && <FindLessonDialog onClose={() => setOpen(false)} />}
    </>
  );
};

const FindLessonDialog: FC<{ onClose: () => void }> = ({ onClose }) => {
  const { lessons, failed } = useLessonCatalog();
  const catalog = useCatalog();
  const { state } = useUserContext();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [course, setCourse] = useState<string>();
  const [level, setLevel] = useState<number>();
  const [language, setLanguage] = useState<string>();
  const [shown, setShown] = useState(PAGE);
  const [copying, setCopying] = useState<string>();
  const [error, setError] = useState("");
  // Typing stays quick while the results catch up.
  const deferredQuery = useDeferredValue(query);

  const topicNames = useMemo(
    () => Object.fromEntries((catalog?.topic ?? []).map((tag) => [tag.value, tag.name])),
    [catalog],
  );
  // The big courses first (Scratch, micro:bit, Python …), not alphabetically (App Inventor).
  const ordered = useMemo(() => {
    if (!lessons) return undefined;
    const counts = new Map<string, number>();
    for (const lesson of lessons) counts.set(lesson.course, (counts.get(lesson.course) ?? 0) + 1);
    return [...lessons].sort(
      (a, b) =>
        counts.get(b.course)! - counts.get(a.course)! ||
        a.courseTitle.localeCompare(b.courseTitle, "nb") ||
        a.title.localeCompare(b.title, "nb"),
    );
  }, [lessons]);
  const results = useMemo(
    () =>
      ordered
        ? searchLessons(ordered, { query: deferredQuery, course, level, language }, topicNames)
        : [],
    [ordered, deferredQuery, course, level, language, topicNames],
  );

  const courseOptions = useMemo(() => {
    const counts = new Map<string, { text: string; count: number }>();
    for (const lesson of lessons ?? []) {
      const entry = counts.get(lesson.course) ?? { text: lesson.courseTitle, count: 0 };
      counts.set(lesson.course, { ...entry, count: entry.count + 1 });
    }
    return [...counts]
      .sort((a, b) => b[1].count - a[1].count)
      .map(([value, { text, count }]) => ({
        key: value,
        value,
        text,
        description: String(count),
      }));
  }, [lessons]);

  const languageOptions = useMemo(() => {
    const codes = new Set((lessons ?? []).flatMap((lesson) => lesson.languages));
    return [...codes].map((code) => {
      const option = languageOption(code);
      return { key: code, value: code, text: option.text, image: option.image };
    });
  }, [lessons]);

  // My copies that are not submitted yet: the server opens these instead of a new copy.
  const myCopies = useMemo(
    () =>
      new Map(
        state.lessons
          .filter((lesson) => lesson.upstream_path && !lesson.submitted)
          .map((lesson) => [lesson.upstream_path!, lesson.lessonId]),
      ),
    [state.lessons],
  );

  const copy = async (lesson: CatalogLesson) => {
    const userId = state.user?.userId;
    if (!userId) return;
    const existing = myCopies.get(`src/${lesson.course}/${lesson.slug}`);
    if (existing) {
      navigate(`/landingpage/${existing}`);
      return;
    }
    setCopying(lesson.slug);
    setError("");
    try {
      const { lessonId } = await copyLessonFromRepo(
        userId,
        lesson.course,
        lesson.slug,
        lesson.courseTitle,
      );
      navigate(`/landingpage/${lessonId}`);
    } catch (e) {
      setError(`«${lesson.title}»: ${importErrorMessage(e)}`);
      setCopying(undefined);
    }
  };

  const filtered = !!(deferredQuery.trim() || course || level || language);
  const clear = () => {
    setQuery("");
    setCourse(undefined);
    setLevel(undefined);
    setLanguage(undefined);
  };

  return (
    <Modal
      open
      onClose={copying ? undefined : onClose}
      closeIcon={!copying}
      size="large"
      dimmer="inverted"
      // At the top, not centred: it would jump up and down as the number of results changes.
      centered={false}
      className="find-lesson"
    >
      <Modal.Header>
        Finn en oppgave fra Lær Kidsa Koding
        <p className="find-lesson__lead">
          Lag en kopi du kan endre. Endringene kan sendes inn som forslag til oppgaven.
        </p>
      </Modal.Header>

      <div className="find-lesson__controls">
        <Input
          fluid
          autoFocus
          icon="search"
          iconPosition="left"
          placeholder="Søk etter tittel, kurs eller tema"
          value={query}
          onChange={(_e, { value }) => {
            setQuery(value);
            setShown(PAGE);
          }}
          aria-label="Søk etter oppgaver"
        />
        <div className="find-lesson__filters">
          <Dropdown
            selection
            clearable
            search
            placeholder="Alle kurs"
            options={courseOptions}
            value={course ?? ""}
            onChange={(_e, { value }) => {
              setCourse((value as string) || undefined);
              setShown(PAGE);
            }}
            aria-label="Kurs"
          />
          <div className="find-lesson__levels" role="group" aria-label="Nivå">
            {LEVELS.map(({ value, name }) => (
              <button
                key={value}
                type="button"
                className="find-lesson__level"
                aria-pressed={level === value}
                onClick={() => {
                  setLevel(level === value ? undefined : value);
                  setShown(PAGE);
                }}
              >
                <img src={levelIcon(value)} alt="" />
                {name}
              </button>
            ))}
          </div>
          <Dropdown
            selection
            clearable
            placeholder="Alle språk"
            options={languageOptions}
            value={language ?? ""}
            onChange={(_e, { value }) => {
              setLanguage((value as string) || undefined);
              setShown(PAGE);
            }}
            aria-label="Språk"
          />
        </div>
      </div>

      <Modal.Content scrolling className="find-lesson__results">
        {error && (
          <Message negative role="alert" size="small">
            {error}
          </Message>
        )}
        {!lessons && !failed && (
          <>
            <p className="find-lesson__count">Henter oppgavene fra kidsakoder.no …</p>
            <div className="find-lesson__grid" aria-hidden="true">
              {Array.from({ length: 8 }, (_, index) => (
                <div key={index} className="find-lesson__card find-lesson__card--skeleton" />
              ))}
            </div>
          </>
        )}
        {failed && (
          <Message warning>
            Fikk ikke hentet oppgavene fra GitHub. Lukk og prøv igjen om litt, eller bruk lenken
            «Rediger oppgave» på oppgaver.kidsakoder.no.
          </Message>
        )}
        {lessons && (
          <>
            <p className="find-lesson__count" aria-live="polite">
              {filtered
                ? `${results.length} av ${lessons.length} oppgaver`
                : `${lessons.length} oppgaver`}
              {filtered && (
                <button type="button" className="find-lesson__clear" onClick={clear}>
                  Vis alle
                </button>
              )}
            </p>
            {results.length === 0 ? (
              <div className="find-lesson__empty">
                <img src="assets/public/maskot.png" alt="" width={96} height={96} />
                <p>Ingen oppgaver passer. Prøv et annet ord, eller fjern et filter.</p>
              </div>
            ) : (
              <div className="find-lesson__grid">
                {results.slice(0, shown).map((lesson) => (
                  <LessonResult
                    key={`${lesson.course}/${lesson.slug}`}
                    lesson={lesson}
                    hasCopy={myCopies.has(`src/${lesson.course}/${lesson.slug}`)}
                    copying={copying === lesson.slug}
                    disabled={!!copying}
                    onCopy={() => copy(lesson)}
                  />
                ))}
              </div>
            )}
            {results.length > shown && (
              <div className="find-lesson__more">
                <Button basic onClick={() => setShown(shown + PAGE)}>
                  Vis flere ({results.length - shown} til)
                </Button>
              </div>
            )}
          </>
        )}
      </Modal.Content>
    </Modal>
  );
};

const LessonResult: FC<{
  lesson: CatalogLesson;
  hasCopy: boolean;
  copying: boolean;
  disabled: boolean;
  onCopy: () => void;
}> = ({ lesson, hasCopy, copying, disabled, onCopy }) => {
  const level = LEVELS.find((item) => item.value === lesson.level);
  return (
    <article className="find-lesson__card">
      <div className={`find-lesson__picture${lesson.image ? "" : " find-lesson__picture--logo"}`}>
        <img
          loading="lazy"
          src={RAW + (lesson.image ?? `src/${lesson.course}/logo-black.png`)}
          alt=""
          onError={(event) => (event.currentTarget.style.visibility = "hidden")}
        />
      </div>
      <div className="find-lesson__body">
        <p className="find-lesson__course">{lesson.courseTitle}</p>
        <h3 className="find-lesson__title">{lesson.title}</h3>
        <div className="find-lesson__meta">
          {level && (
            <span className="find-lesson__chip" title={`Nivå: ${level.name}`}>
              <img src={levelIcon(level.value)} alt="" />
              {level.name}
            </span>
          )}
          <span className="find-lesson__flags">
            {lesson.languages.map((code) => {
              const option = languageOption(code);
              return (
                <img key={code} src={option.image?.src} alt={option.text} title={option.text} />
              );
            })}
          </span>
          {lesson.teacherGuide && (
            <span className="find-lesson__chip" title="Har lærerveiledning">
              <Icon name="graduation cap" />
              Veiledning
            </span>
          )}
        </div>
      </div>
      <div className="find-lesson__actions">
        <Button
          positive
          size="small"
          loading={copying}
          disabled={disabled}
          onClick={onCopy}
          aria-label={`${hasCopy ? "Åpne kopien din av" : "Lag en kopi av"} ${lesson.title}`}
        >
          {hasCopy ? "Åpne kopien din" : "Lag kopi"}
        </Button>
        <a
          className="find-lesson__view"
          href={`https://oppgaver.kidsakoder.no/${lesson.course}/${lesson.slug}/${lesson.text}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Se oppgaven
        </a>
      </div>
    </article>
  );
};

export default FindLessonModal;
