import React, { Component } from 'react';
import "./OverviewStyle.css";
import Navbar from './Navbar';
import ItemList from './ItemList'
import LeftBox from './LeftBox';
import RightBox from './RightBox';


class Overview extends Component { 
  render() {
  return (

    <div>
      <Navbar />
     <div  className= "OverviewBox">
       
    <div className = "ui stackable four column grid">
      <div className="row">
      <div className="left floated computer only three wide column">
      <LeftBox/>
      </div>
      <div className="eight wide column">
      <ItemList />
      </div>
      <div className="right floated computer only three wide column">
      <RightBox/>
      </div>
      </div>
    </div>
    </div>
    </div>

  )

}
}
export default Overview;


