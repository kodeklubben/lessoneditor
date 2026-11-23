import "./textswitcher.scss";
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Dropdown } from "semantic-ui-react";
import { useLessonContext } from "../../contexts/LessonContext";
import { filenameParser } from "../../utils/filename-parser";
import { compareLanguages, languageOption } from "../frontpage/settings/newLessonOptions";

interface Text {
  language: string;
  isReadme: boolean;
}

const kindName = (isReadme: boolean) => (isReadme ? "Lærerveiledning" : "Oppgavetekst");

/**
 * Which text is open, in the top bar: the flag, the language and lesson text or teacher guide.
 * It is also the way to the lesson's other texts, for translating side by side with the original.
 */
const TextSwitcher: FC = () => {
  const { lessonId, file, lang } = useParams() as { lessonId: string; file: string; lang: string };
  const navigate = useNavigate();
  const { fetchFileList, state } = useLessonContext();
  const [texts, setTexts] = useState<Text[]>([]);
  const isReadme = file === "README";
  const current = languageOption(lang);

  useEffect(() => {
    let active = true;
    fetchFileList()
      .then((names: string[]) => {
        if (!active) return;
        const list = names
          .map((name) => filenameParser(name))
          .filter((text) => text.isMarkdown && text.language)
          .map(({ language, isReadme }) => ({ language, isReadme }))
          .sort(
            (a, b) =>
              Number(a.isReadme) - Number(b.isReadme) || compareLanguages(a.language, b.language),
          );
        setTexts(list);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
    // The list is read once per text that is opened.
  }, [lessonId, file, lang]);

  const label = (
    <span className="text-switcher__label">
      <img src={current.image?.src} alt="" className="text-switcher__flag" />
      <span className="text-switcher__language">{current.text}</span>
      <span className="text-switcher__kind">{kindName(isReadme)}</span>
    </span>
  );

  const others = texts.filter((text) => text.language !== lang || text.isReadme !== isReadme);
  if (others.length === 0) {
    return <div className="text-switcher text-switcher--single">{label}</div>;
  }

  const slug = state.lesson?.lessonSlug;
  return (
    <Dropdown
      className="text-switcher"
      trigger={label}
      icon="dropdown"
      aria-label={`Åpen tekst: ${kindName(isReadme).toLowerCase()} på ${current.text.toLowerCase()}. Bytt tekst`}
    >
      <Dropdown.Menu>
        <Dropdown.Header content="Andre tekster i oppgaven" />
        {others.map((text) => {
          const option = languageOption(text.language);
          return (
            <Dropdown.Item
              key={`${text.isReadme}-${text.language}`}
              onClick={() =>
                navigate(`/editor/${lessonId}/${text.isReadme ? "README" : slug}/${text.language}`)
              }
            >
              <img src={option.image?.src} alt="" className="text-switcher__flag" />
              {option.text}
              <span className="text-switcher__kind">{kindName(text.isReadme)}</span>
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default TextSwitcher;
