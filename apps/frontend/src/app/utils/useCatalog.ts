import { useEffect, useState } from "react";
import axios from "axios";
import { LessonCatalog, paths } from "@lessoneditor/contracts";

// One request per page load, shared by every dialog that needs it.
let request: Promise<LessonCatalog | null> | undefined;

/**
 * Courses and topic/subject/grade tags as the lesson repo has them (#335). Undefined while
 * loading and null when the server could not read the repo: then the built-in lists apply.
 */
export function useCatalog(): LessonCatalog | null | undefined {
  const [catalog, setCatalog] = useState<LessonCatalog | null | undefined>(undefined);
  useEffect(() => {
    let active = true;
    request ??= axios
      .get<LessonCatalog | null>(paths.CATALOG)
      .then(({ data }) => data || null)
      .catch(() => {
        request = undefined;
        return null;
      });
    void request.then((value) => active && setCatalog(value));
    return () => {
      active = false;
    };
  }, []);
  return catalog;
}
