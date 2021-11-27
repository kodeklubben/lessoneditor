import { useEffect, FC, useState } from "react";
import axios from "axios";
import { Lesson, paths, User } from "@lessoneditor/api-interfaces";

const Dummy: FC = () => {
  const [userContexState, setUserContextState] = useState({});
  const [error, setError] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const userRes = await axios.get(paths.USER);
        const userLessonsRes = await axios.get(
          paths.USER_LESSONS.replace(":userId", userRes.data.userId.toString())
        );
        setUserContextState((s) => {
          return {
            ...s,
            user: userRes.data,
            lessons: userLessonsRes.data,
            loggedIn: true,
          };
        });
      } catch (error: any) {
        setError(error);
      }
    }
    fetchData();
    console.log(userContexState);
  }, []);
  return (
    <div>
      <h1>TEST</h1>
    </div>
  );
};

export default Dummy;
