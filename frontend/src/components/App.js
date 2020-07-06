import React from "react";
import FormComponent from "./lessonForm/FormComponent";
import EndPage from "./frontPageComponents/EndPage";
import Editor from "./mdTextEditor/editor/Editor";
import IndexPage from "./frontPageComponents/IndexPage";
import Overview from "./mypage/Overview";
import { BrowserRouter, Route } from "react-router-dom";
import NewLesson from "./newLesson/NewLesson";
import { LessonContextProvider } from "../contexts/LessonContext";
import { UserContextProvider } from "../contexts/UserContext";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <Route exact path="/" component={IndexPage} />
          <Route exact path="/myPage" component={Overview} />
          <Route exact path="/createNewLesson" component={FormComponent} />
          <Route exact path="/new-lesson" component={NewLesson} />
          <Route exact path="/editor" component={Editor} />
          <Route path="/editor/:course/:lesson/:file">
            <LessonContextProvider>
              <Editor />
            </LessonContextProvider>
          </Route>
          <Route exact path="/endpage" component={EndPage} />
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
