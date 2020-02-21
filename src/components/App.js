import "./App.css";
import React from "react";
import YAMLformPage from "./YAMLformpage";
import YMLfilePage from "./YMLfilePage";

class App extends React.Component {
  onYAMLSubmitHandler = state => {
    //ToDo:  Get state-data from YAMLformpage an send it to database via axios.
    console.log(state);
  };

  onYMLSubmitHandler = state => {
    //ToDo:  Get state-data from YAMLformpage an send it to database via axios.
    console.log(state);
  };

  render() {
    return (
      <div className="root container">
        {/* <YAMLformPage onSubmit={this.onYAMLSubmitHandler} /> */}
        <YMLfilePage onSubmit={this.onYMLSubmitHandler} />
      </div>
    );
  }
}

export default App;
