import React, { FC, useEffect, useState } from "react";
import { FileDTO, HeaderData, UpdatedFileDTO } from "@lessoneditor/contracts";
import axios from "axios";
import { Button, Icon, Modal } from "semantic-ui-react";
import { paths } from "@lessoneditor/contracts";
import { useParams } from "react-router";
import MDPreview from "../editor/MDPreviewArea";
import { useLessonContext } from "../../contexts/LessonContext";

type MarkdownPreviewProps = {
  filename: string;
  showMDPreview: boolean;
  setShowMDPreview: any;
};

const separator = "---\n";

const MarkdownPreview: FC<MarkdownPreviewProps> = ({
  filename,
  showMDPreview,
  setShowMDPreview,
}) => {
  const [text, setText] = useState<string>("");

  const { lessonId, file, lang } = useParams() as any;
  const { state } = useLessonContext();
  const { courseSlug } = state.lesson;

  useEffect(() => {
    async function fetchText() {
      console.log(filename);
      try {
        const result = await axios.get<FileDTO<string>>(
          paths.LESSON_FILE.replace(":lessonId", lessonId).replace(":fileName", filename)
        );
        const [_, header, body] = result.data.content.split(separator);

        setText(body);
      } catch (error) {
        console.error(error);
      }
    }

    fetchText();
  }, [filename, lessonId]);

  return (
    <>
      {text.length > 0 ? (
        <Modal open={showMDPreview} onClose={() => setShowMDPreview(false)} dimmer="inverted">
          <Modal.Content style={{ position: "relative" }}>
            <MDPreview mdText={text} course={courseSlug} language={lang} preview={true} />
            <Button
              onClick={() => setShowMDPreview(false)}
              style={{
                position: "absolute",
                background: "none",
                top: "0",
                right: "0",
                zIndex: "30",
              }}
              icon
            >
              <Icon size="huge" name="x" />
            </Button>
          </Modal.Content>
        </Modal>
      ) : (
        <div></div>
      )}
    </>
  );
};

export default MarkdownPreview;
