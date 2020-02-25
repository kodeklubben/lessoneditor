import "./App.css";
import React from "react";
import FormComponent from "./YAMLComponents/FormComponent";

import Editor from "./mdPreviewComponents/Editor";
import { IndexPage } from "./frontPageComponents/IndexPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      /*To render the wanted component, add it to the div below:
       * <FormComponent/>, <Editor/> or <IndexPage/>*/
      <Router>
        <Switch>
          <Route exact path="/">
            <div className="root">
              <IndexPage />
            </div>
          </Route>
          <Route path="/createNewLesson">
            <FormComponent />
          </Route>
          <Route path="/editor">
            <Editor />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
