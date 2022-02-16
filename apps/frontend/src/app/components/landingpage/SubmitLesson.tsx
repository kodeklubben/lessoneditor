import React, { useState } from "react";
import SubmitLessonCard from "./SubmitLessonCard";
import SubmitModal from "../landingpage_old/SubmitModal";
import { useParams } from "react-router-dom";

const SubmitLesson = () => {
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const { lessonId } = useParams() as any;
  return (
    <>
      {openSubmitModal && (
        <SubmitModal
          openSubmitModal={openSubmitModal}
          setOpenSubmitModal={setOpenSubmitModal}
          lessonId={lessonId}
        />
      )}
      <div>
        <SubmitLessonCard />
      </div>
    </>
  );
};

export default SubmitLesson;
