import React, { Component } from "react";
//import "./OverviewStyle.css";
import Navbar from "./Navbar";
import ItemList from "./ItemList";
import LeftBox from "./LeftBox";
import RightBox from "./RightBox";

class Overview extends Component {
  render() {
    return (
      <div className="OverviewBox">
        <Navbar />
        <div class="row">
          <div class="col-sm-3">
            <LeftBox />
          </div>
          <div class="col-sm-6">
            <ItemList />
          </div>
          <div class="col-sm-3">
            <RightBox />
          </div>
        </div>
      </div>
    );
  }
}
export default Overview;
