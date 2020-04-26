import React from "react";
import FormComponent from "./lessonForm/FormComponent";
import EndPage from "./frontPageComponents/EndPage";
import Editor from "./mdTextEditor/editor/Editor";
import IndexPage from "./frontPageComponents/IndexPage";
import Overview from "./mypage/Overview";
import { BrowserRouter, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Route exact path="/" component={IndexPage} />
          <Route path="/myPage" component={Overview} />
          <Route path="/createNewLesson" component={FormComponent} />
          <Route path="/editor" component={Editor} />
          <Route exact path="/endpage" component={EndPage} />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
