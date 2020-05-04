import React from "react";
// import "./NavbarStyle.css";
import Logo from "./logo.jpg";

function Navbar() {
  return (
    <div>
      <div className="ui massive myNavbar stackable menu">
        <div className=" logo">
          <img alt='' src={Logo}/>
        </div>
        <div className="right menu">
        <a className="item" href = "https://www.kidsakoder.no/kodeklubben/kodeklubboversikt/">Finn kodeklub</a>
        <a className="item" href = "https://oppgaver.kidsakoder.no/">Oppgaver</a>
        <a className="item"  href = "https://www.kidsakoder.no/om-lkk/">Hjem</a>
        <a className="item"  href = "#minside">Min side</a>
        </div>
        </div>
        
    </div>
  );
}
export default Navbar;
