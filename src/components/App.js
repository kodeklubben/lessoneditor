import "./App.css";
import React from "react";
import FormComponent from "./YAMLComponents/FormComponent";
import Editor from "./mdPreviewComponents/editor";
import {IndexPage} from "./frontPageComponents/indexPage";


class App extends React.Component {

  render() {
    return (
        /*To render the wanted component, add it to the div below:
        * <FormComponent/>, <Editor/> or <IndexPage/>*/
      <div className="root container">
        <IndexPage/>
      </div>
    );
  }
}

export default App;
