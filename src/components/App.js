import React from "react";
import FormComponent from "./YAMLComponents/FormComponent";
import EndPage from "./frontPageComponents/EndPage";
import MarkdownEditor from "./mdPreviewComponents/MarkdownEditor";
// import Editor from "./mdPreviewComponents/Editor";
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
          <Route path="/editor" component={MarkdownEditor} />
          <Route exact path="/endpage" component={EndPage} />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
