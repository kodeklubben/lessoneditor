import "./simple-preview.scss";
import React, { useEffect, useState } from "react";
import fetchMdText from "../../api/fetch-md-text";
import MDPreview from "../editor/MDPreview";
import { useParams } from "react-router";

const SimplePreview = () => {
  const { lessonId, file } = useParams();
  const [mdText, setMdText] = useState("");
  const [status, setStatus] = useState("Loading...");
  useEffect(() => {
    if (lessonId && file) {
      async function fetchData() {
        const text = await fetchMdText(lessonId, file);
        if (mdText === "") {
          setStatus("Not found...");
        }
        setMdText(text);
      }

      fetchData();
    }
  }, [lessonId, file, mdText]);
  return (
    <div className={"simple-preview"}>
      {mdText !== "" ? <MDPreview mdText={mdText} /> : <div>{status}</div>}
    </div>
  );
};

export default SimplePreview;
