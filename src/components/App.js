import "./App.css";
import React from "react";
import FormComponent from "./YAMLComponents/FormComponent";
import Overview from './mypage/Overview';
import LeftBox from './mypage/LeftBox';


import Editor from "./mdPreviewComponents/Editor";
import { IndexPage } from "./frontPageComponents/IndexPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <LeftBox/>

      /*To render the wanted component, add it to the div below:
       * <FormComponent/>, <Editor/> or <IndexPage/>*/
      /*<Router>
        <Switch>
          <Route exact path="/">
            <IndexPage />
          </Route>
          <Route path="/createNewLesson">
            <FormComponent />
          </Route>
          <Route path="/editor">
            <div className="controlPanelPlacement">
              <Editor />
            </div>
          </Route>
        </Switch>
      </Router>*/
    );
  }
}

export default App;
