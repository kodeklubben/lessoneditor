import { useEffect, useState } from "react";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { base64StringToBlob, createObjectURL } from "blob-util";
import { onThumbnail } from "../../utils/thumbnailEvents";

/**
 * One text's own thumbnail (1): each language row shows its own content, not the lesson's one
 * preview. Fetched again when that text gets a new one. Undefined until the text has one.
 */
export function useTextThumbnail(
  lessonId: number | string,
  filename: string,
  enabled = true,
): string | undefined {
  const [url, setUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const load = () =>
      axios
        .get<string>(
          paths.LESSON_TEXT_THUMB.replace(":lessonId", String(lessonId)).replace(
            ":filename",
            encodeURIComponent(filename),
          ),
        )
        .then(({ data }) => {
          if (active && data) setUrl(createObjectURL(base64StringToBlob(data, "image/png")));
        })
        .catch(() => undefined);
    void load();
    const stop = onThumbnail((id, name) => {
      if (id === Number(lessonId) && name === filename) void load();
    });
    return () => {
      active = false;
      stop();
    };
  }, [lessonId, filename, enabled]);
  return url;
}
