import React from "react";
import FormComponent from "./lessonForm/FormComponent";
import Endpage from "./endpage/Endpage";
import Editor from "./editor/Editor";
import Landingpage from "components/landingpage/Landingpage";
import Frontpage from "./frontpage/Frontpage";
import { BrowserRouter, Route } from "react-router-dom";
import { LessonContextProvider } from "../contexts/LessonContext";
import { UserContextProvider } from "../contexts/UserContext";
import SimplePreview from "./simple-preview/simple-preview";
//import NewLessonButton from "./frontpage/newLessonButton";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <Route exact path="/" component={Frontpage}>
            <LessonContextProvider>
              <Frontpage />
            </LessonContextProvider>
          </Route>
          <Route exact path="/new-lesson" component={FormComponent} />
          <Route exact path="/landingpage" component={Landingpage} />
          <Route path="/landingpage/:lessonId">
            <LessonContextProvider>
              <Landingpage />
            </LessonContextProvider>
          </Route>
          <Route exact path="/editor" component={Editor} />
          <Route path="/editor/:lessonId/:file">
            <LessonContextProvider>
              <Editor />
            </LessonContextProvider>
          </Route>
          <Route path="/preview/:lessonId/:file" component={SimplePreview} />
          <Route exact path="/endpage" component={Endpage} />
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
