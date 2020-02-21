import "./App.css";
import React from "react";
import YAMLformPage from "./YAMLformpage";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmitHandler = state => {
    //ToDo:  Get state-data from YAMLformpage an send it to database via axios.
    console.log(state);
  };

  render() {
    return (
      <div className="root container">
        <YAMLformPage onSubmit={this.onSubmitHandler} />
      </div>
    );
  }
}

export default App;
