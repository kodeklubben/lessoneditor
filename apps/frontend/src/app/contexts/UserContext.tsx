import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { paths } from "@lessoneditor/contracts";
import { LessonDTO, NewLessonDTO } from "@lessoneditor/contracts";
import { UserDTO } from "@lessoneditor/contracts";

import {
  initialUserContextState,
  UserContextModel,
  UserContextState,
} from "./userContext.functions";
import NotLoggedInPage from "../pages/NotLoggedInPage";
import ShowSpinner from "../components/ShowSpinner";
import { isPreviewImage } from "../components/shared/PreviewImage";
import { base64StringToBlob, createObjectURL } from "blob-util";
import { onThumbnail } from "../utils/thumbnailEvents";

export const UserContext = React.createContext({} as UserContextModel);

export const UserContextProvider = (props: any) => {
  const [userContexState, setUserContextState] =
    useState<UserContextState>(initialUserContextState);
  const [loading, setLoading] = useState<boolean>(true);
  const [previewImage, setPreviewImages] = useState({});

  const lessonsUrl = (userId: number) => paths.USER_LESSONS.replace(":userId", String(userId));

  /** Each lesson's thumbnail; a lesson without one (or a failed request) just shows no image. */
  const fetchPreviews = (lessons: Pick<LessonDTO, "lessonId">[]) =>
    lessons.forEach(async ({ lessonId }) => {
      try {
        const file = await axios.get(
          paths.LESSON_FILE.replace(":lessonId", String(lessonId)).replace(":filename", "preview"),
        );
        if (!isPreviewImage(file.data)) return;
        setPreviewImages((prevImages) => ({
          ...prevImages,
          [lessonId]: createObjectURL(base64StringToBlob(file.data, "image/png")),
        }));
      } catch {
        // No preview yet.
      }
    });

  // Once per page: the provider is mounted per route, so it does not need to follow the location.
  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        const userRes = await axios.get<UserDTO>(paths.USER);
        const userLessonsRes = await axios.get<LessonDTO[]>(lessonsUrl(userRes.data.userId));
        if (!active) return;
        fetchPreviews(userLessonsRes.data);
        setUserContextState((s) => ({
          ...s,
          user: userRes.data,
          lessons: userLessonsRes.data,
          loggedIn: true,
        }));
      } catch {
        // Not logged in (401) or the session is gone: the login page is shown.
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => {
      active = false;
    };
  }, []);

  // A thumbnail made after this page loaded (the editor was just left): show it without a reload.
  useEffect(() => onThumbnail((lessonId) => fetchPreviews([{ lessonId }])), []);

  const getLesson = (lessonId: number): LessonDTO | undefined => {
    return userContexState.lessons?.find((item: LessonDTO) => item.lessonId === lessonId);
  };

  const refreshLessons = async () => {
    const userLessonsRes = await axios.get<LessonDTO[]>(lessonsUrl(userContexState.user!.userId));
    setUserContextState((s) => ({ ...s, lessons: userLessonsRes.data }));
  };

  const logoutUser = async () => {
    try {
      await axios.post(paths.AUTH_LOGOUT);
    } catch {
      // The session is removed on the server either way; the page goes to /logout.
    }
  };

  const addLesson = async (
    courseSlug: string,
    courseTitle: string,
    lessonSlug: string,
    lessonTitle: string,
    language: string,
  ): Promise<number | undefined> => {
    try {
      const newLesson: NewLessonDTO = {
        courseSlug,
        courseTitle,
        lessonSlug,
        lessonTitle,
        language,
      };
      const newLessonRes = await axios.post<number>(
        paths.USER_LESSON_NEW.replace(":userId", userContexState.user!.userId.toString()),
        newLesson,
      );
      await refreshLessons();
      return newLessonRes.data;
    } catch (error) {
      // The dialog shows why (a name that is taken, for instance).
      console.error(error);
      throw error;
    }
  };

  /** Throws when the server refuses (e.g. only the creator may delete), so the dialog can say so. */
  const removeLesson = async (lessonId: number) => {
    if (!getLesson(lessonId)) return;
    await axios.delete(
      paths.USER_LESSON_UPDATE.replace(":userId", userContexState.user!.userId.toString()).replace(
        ":lessonId",
        lessonId.toString(),
      ),
    );
    await refreshLessons();
  };

  const context: UserContextModel = {
    state: userContexState,
    addLesson: addLesson,
    logoutUser: logoutUser,
    removeLesson: removeLesson,
    previewImage,
    loading,
  };

  if (userContexState.loggedIn) {
    return <UserContext.Provider value={context}>{props.children}</UserContext.Provider>;
  }
  // A spinner while the session is checked, so logged-in users do not see the login page flash.
  return loading ? <ShowSpinner /> : <NotLoggedInPage />;
};
export const useUserContext = (): UserContextModel => useContext<UserContextModel>(UserContext);
