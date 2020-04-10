import "./App.css";
import React from "react";
import FormComponent from "./YAMLComponents/FormComponent";
import EndPage from "./frontPageComponents/EndPage";
import Editor from "./mdPreviewComponents/Editor";
import { IndexPage } from "./frontPageComponents/IndexPage";
import { BrowserRouter, Route } from "react-router-dom";

<<<<<<< HEAD
const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
          <Route exact path="/" component={IndexPage} />
          <Route path="/createNewLesson" component={FormComponent} />
          <Route path="/editor" component={Editor} />
          <Route exact path="/endpage" component={EndPage} />
        </div>
      </BrowserRouter>
    </div>
  );
};
=======
class App extends React.Component {
  render() {
    return (
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
          <Route path="/editor">
            {/* <div className="controlPanelPlacement"> */}
            <Editor />
            {/* </div> */}
          </Route>
          <Route exact path="/endpage">
            <EndPage />
          </Route>
        </Switch>
      </Router>
    );
  }
}
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43

export default App;
