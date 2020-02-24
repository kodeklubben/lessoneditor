import "./App.css";
import React from "react";
import FormComponent from "./YAMLComponents/FormComponent";


class App extends React.Component {

  render() {
    return (
      <div className="root container">
        <FormComponent/>
      </div>
    );
  }
}

export default App;
