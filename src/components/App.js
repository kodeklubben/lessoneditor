import "./App.css";
import React from "react";
import FormComponent from "./YAMLComponents/FormComponent";
import Editor from "./mdPreviewComponents/Editor";
import { IndexPage } from "./frontPageComponents/IndexPage";
import EndPage from "./frontPageComponents/EndPage";

class App extends React.Component {
  render() {
    return (
      /*To render the wanted component, add it to the div below:
       * <FormComponent/>, <Editor/> or <IndexPage/>*/
      <div className="root">
        <IndexPage />
      </div>
    );
  }
}

export default App;
