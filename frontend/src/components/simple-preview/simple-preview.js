import "./simple-preview.scss";
import React, { useEffect, useState } from "react";
import fetchMdText from "../../api/fetch-md-text";
import MDPreview from "../editor/MDPreview";
import { useParams } from "react-router";

import parseMdHeader from "../editor/utils/parseMdHeader";

const SimplePreview = () => {
  const { lessonId, file } = useParams();
  const [mdText, setMdText] = useState("");
  const [status, setStatus] = useState("Loading...");
  useEffect(() => {
    if (lessonId && file) {
      let test = "";
      async function fetchData() {
        let text = await fetchMdText(lessonId, file);
        if (mdText === "") {
          setStatus("Not found...");
        }
        setMdText(text);
      }

      fetchData();
      try {
        test = parseMdHeader(mdText).body;
        setMdText(test);
      } catch (e) {
        console.log(e);
      }
    }
  }, [lessonId, file, mdText]);
  return (
    <div className={"simple-preview"}>
      {mdText !== "" ? <MDPreview mdText={mdText} /> : <div>{status}</div>}
    </div>
  );
};

export default SimplePreview;
