import { useState, ReactNode } from "react";
import { Modal, Image } from "semantic-ui-react";
import MDPreview from "../editor/MDPreviewArea";

export const MdPreviewModal = (
  language: string,
  course: string,
  mdText: string,
  component: ReactNode
) => {
  const [open, setOpen] = useState<boolean>();

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={component}
    >
      <MDPreview mdText={mdText} course={course} language={language} preview={false} />
    </Modal>
  );
};

export const ImageModal = (url: string, component: ReactNode) => {
  const [open, setOpen] = useState<boolean>();

  return (
    <Modal
      closeIcon
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={component}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src={url} size="large" rounded />
        <i style={{ paddingBottom: "0.5em" }}>{url.split("/").pop()}</i>
      </div>
    </Modal>
  );
};
