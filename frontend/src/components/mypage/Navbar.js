import React from "react";
// import "./NavbarStyle.css";
import Logo from "./logo.jpg";

let navText = ["Finn kodeklubb", "Oppgaver", "Hjelp", "Min side"];

function Navbar() {
  return (
    <div>
      <div className="ui massive myNavbar stackable menu">
        <div className=" logo">
          <img alt="" src={Logo} />
        </div>
        <div className="right menu">
          <a
            className="item"
            href="https://www.kidsakoder.no/kodeklubben/kodeklubboversikt/"
          >
            {navText[0]}
          </a>
          <a className="item" href="https://oppgaver.kidsakoder.no/">
            {navText[1]}
          </a>
          <a className="item" href="https://www.kidsakoder.no/om-lkk/">
            {navText[2]}
          </a>
          <a className="item" href="#minside">
            {navText[3]}
          </a>
        </div>
      </div>
    </div>
  );
}
export default Navbar;
