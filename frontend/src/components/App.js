import React from "react";
import FormComponent from "./lessonForm/FormComponent";
import EndPage from "./frontPageComponents/EndPage";
import Editor from "./mdTextEditor/editor/Editor";
import IndexPage from "./frontPageComponents/IndexPage";
import Overview from "./mypage/Overview";
import { BrowserRouter, Route } from "react-router-dom";
import { UserContextProvider } from "./UserContext";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <UserContextProvider>
          <Route exact path="/" component={IndexPage} />
          <Route exact path="/myPage" component={Overview} />
          <Route exact path="/createNewLesson" component={FormComponent} />
          <Route exact path="/editor" component={Editor} />
          <Route exact path="/endpage" component={EndPage} />
        </UserContextProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
