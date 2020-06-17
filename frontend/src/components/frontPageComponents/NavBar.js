import React from "react";
import logo from "./public/logo.jpg";
import "./style.css";

const navContent = [
  { href: "https://www.kidsakoder.no/om-lkk/", text: "Om LKK" },
  { href: "https://www.kidsakoder.no/nyheter/", text: "Nyheter" },
  {
    href: "https://www.kidsakoder.no/kodeklubben/kodeklubboversikt/",
    text: "Finn kodeklubb",
  },
  { href: "https://www.kidsakoder.no/kodeklubben/", text: "Kodeklubben" },
  { href: "https://www.kidsakoder.no/skole/", text: "Skole" },
  { href: "https://www.kidsakoder.no/kodetimen/", text: "Kodetimen" },
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
            {navbarText.map((element, index) => (
              <li key={"element" + index}>
                <a href={element.href}> {element.text} </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="Clear"></div>
      </div>
    </div>
  );
};

export default NavBar;
