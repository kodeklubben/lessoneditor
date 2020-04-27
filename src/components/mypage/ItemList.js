import React, { Component } from "react";
// import './ItemList.css'

class ItemList extends Component {
  state = {
    listitems: ["Oppgave 1", "Oppgave 2", "Oppgave 3"]
  };

  render() {
    return (
      <React.Fragment>
        <div className=".container my-container">
          <ul className="list-group">
            {this.state.listitems.map(listitem => (
              <li className="list-group-item list-group-item-action">
                {listitem}
              </li>
            ))}
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

export default ItemList;
