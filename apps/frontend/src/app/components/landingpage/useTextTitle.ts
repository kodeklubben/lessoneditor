import { useEffect, useState } from "react";
import axios from "axios";
import { FileDTO, paths, parseLessonMarkdown } from "@lessoneditor/contracts";

/**
 * The title written in one text's own front matter: «Skritteljar» for the nynorsk text, not the
 * project title «Skritteller» every language showed before (V4). Undefined until it is read or
 * when the text has none.
 */
export function useTextTitle(lessonId: number | string, filename: string): string | undefined {
  const [title, setTitle] = useState<string | undefined>(undefined);
  useEffect(() => {
    let active = true;
    axios
      .get<FileDTO<string>>(
        paths.LESSON_FILE.replace(":lessonId", String(lessonId)).replace(
          ":filename",
          encodeURIComponent(filename),
        ),
      )
      .then(({ data }) => {
        const value = parseLessonMarkdown<{ title?: unknown }>(data.content).data.title;
        if (active) setTitle(typeof value === "string" && value.trim() ? value.trim() : undefined);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [lessonId, filename]);
  return title;
}
