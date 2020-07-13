import "./simple-preview.css";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import fetchMdText from "../../api/fetch-md-text";
import MDPreview from "../mdTextEditor/mdPreview/MDPreview";

const SimplePreview = () => {
  const { course, lesson, file } = useParams();
  const [mdText, setMdText] = useState("");
  useEffect(() => {
    if (course && lesson && file) {
      async function fetchData() {
        let text = await fetchMdText(course, lesson, file);
        setMdText(text);
      }
      fetchData();
    }
  }, [course, lesson, file]);
  return (
    <div className={"simple-preview"}>
      <MDPreview mdText={mdText} />
    </div>
  );
};

export default SimplePreview;
