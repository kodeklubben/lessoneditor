import React from "react";
import FormComponent from "./YAMLComponents/FormComponent";
import EndPage from "./frontPageComponents/EndPage";
import MarkdownEditor from "./mdPreviewComponents/MarkdownEditor";
// import Editor from "./mdPreviewComponents/Editor";
import IndexPage from "./frontPageComponents/IndexPage";
import { BrowserRouter, Route } from "react-router-dom";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Route exact path="/" component={IndexPage} />
          <Route path="/createNewLesson" component={FormComponent} />
          <Route path="/editor" component={MarkdownEditor} />
          <Route exact path="/endpage" component={EndPage} />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
