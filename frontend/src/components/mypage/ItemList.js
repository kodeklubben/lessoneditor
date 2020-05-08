import React, { Component } from "react";
// import './ItemList.css'

class ItemList extends Component {
    
    state = {
        listitems: ["Oppgave 1", "Oppgave 2", "Oppgave 3", "Oppgave 4", "Oppgave 5"]
      };

    render() {
      
      const mystyle = {
        
        padding: "10px",
        fontFamily: "Arial",
        fontSize:"20px"
        
      };
        return (
            <React.Fragment>
            <div className=".container my-container">
            <div className="ui middle aligned divided list">
              {this.state.listitems.map(listitem => (
                <div className="item" >
                  <div className="right floated content">
                  <div className="ui button">Rediger</div>
                  </div>
                  <div className="content" style={mystyle}>
                {listitem}
                </div>
                </div>
              ))}
            </div>
            </div>
          </React.Fragment>
        );
    }
}

export default ItemList;
