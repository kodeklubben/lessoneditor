import React from "react";
import FormComponent from "./lessonForm/FormComponent";
import Endpage from "./endpage/Endpage";
import Editor from "./editor/Editor";
import Frontpage from "./frontpage/Frontpage";
import { BrowserRouter, Route } from "react-router-dom";
import { LessonContextProvider } from "../contexts/LessonContext";
import { UserContextProvider } from "../contexts/UserContext";
import SimplePreview from "./simple-preview/simple-preview";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <Route exact path="/" component={Frontpage} />
          <Route exact path="/new-lesson" component={FormComponent} />
          <Route exact path="/editor" component={Editor} />
          <Route path="/editor/:course/:lesson/:file">
            <LessonContextProvider>
              <Editor />
            </LessonContextProvider>
          </Route>
          <Route
            path="/preview/:course/:lesson/:file"
            component={SimplePreview}
          />
          <Route exact path="/endpage" component={Endpage} />
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
