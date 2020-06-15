import React from "react";
import logo from "./public/logo.jpg";
import "./style.css";

let navbarText = [
  "Om LKK",
  "Nyheter",
  "Finn kodeklubb",
  "Kodeklubben",
  "Skole",
  "Kodetimen"
];

const NavBar = () => {
  return (
    <div>
      <div className="navbar-container">
        <div className="logo">
          <a href="#default.asp"> </a>
        </div>
        <div className="navbar">
          <ul>
            <li>
              <a href="https://www.kidsakoder.no/om-lkk/"> {navbarText[0]} </a>
            </li>
            <li>
              <a href="https://www.kidsakoder.no/nyheter/"> {navbarText[1]} </a>
            </li>
            <li>
              <a href="https://www.kidsakoder.no/kodeklubben/kodeklubboversikt/">
                {navbarText[2]}
              </a>
            </li>

            <li>
              <a href="https://www.kidsakoder.no/kodeklubben/">
                {navbarText[3]}
              </a>
            </li>
            <li>
              <a href="https://www.kidsakoder.no/skole/"> {navbarText[4]} </a>
            </li>
            <li>
              <a href="https://www.kidsakoder.no/kodetimen/">
                {" "}
                {navbarText[5]}{" "}
              </a>
            </li>
          </ul>
        </div>
        <div className="Clear"></div>
      </div>
    </div>
  );
};

export default NavBar;
