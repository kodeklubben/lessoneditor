import "./simple-preview.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import fetchMdText from "../../api/fetch-md-text";
import MDPreview from "../editor/MDPreview";

const SimplePreview = () => {
  const { course, lesson, file } = useParams();
  const [mdText, setMdText] = useState("");
  const [status, setStatus] = useState("Loading...");
  useEffect(() => {
    if (course && lesson && file) {
      async function fetchData() {
        let text = await fetchMdText(course, lesson, file);
        if (mdText === "") {
          setStatus("Not found...");
        }
        setMdText(text);
      }

      fetchData();
    }
  }, [course, lesson, file, mdText]);
  return (
    <div className={"simple-preview"}>
      {mdText !== "" ? <MDPreview mdText={mdText} /> : <div>{status}</div>}
    </div>
  );
};

export default SimplePreview;
