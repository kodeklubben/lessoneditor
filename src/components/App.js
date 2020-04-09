import "./App.css";
import React from "react";
import IndexPage from '../components/frontPageComponents/IndexPage';
import FormComponent from '../components/YAMLComponents/FormComponent';
import Editor from '../components/mdPreviewComponents/Editor';


import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Overview from "./mypage/Overview";

class App extends React.Component {
  render() {
    return (
      
      /*<LeftBox/>*/

      /*To render the wanted component, add it to the div below:
       * <FormComponent/>, <Editor/> or <IndexPage/>*/
      <Router>
        <Switch>
          <Route exact path="/">
            <IndexPage />
          </Route>
          <Route path="/createNewLesson">
            <FormComponent />
          </Route>
          <Route path="/myPage">
            <Overview />
          </Route>
          <Route path="/editor">
            <div className="controlPanelPlacement">
              <Editor />
            </div>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
