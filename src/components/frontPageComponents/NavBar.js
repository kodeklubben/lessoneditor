import React from "react";
import logo from "./public/logo.jpg";
import "./style.css";
export class NavBar extends React.Component {
  render() {
    return (
      <div>
        <div className="navbar-container">
          <div className="logo">
            <a href="#default.asp"> </a>
          </div>
          <div className="navbar">
            <ul>
              <li>
                <a href="https://www.kidsakoder.no/om-lkk/"> Om LKK </a>
              </li>
              <li>
                <a href="https://www.kidsakoder.no/nyheter/"> Nyheter </a>
              </li>
              <li>
                <a href="https://www.kidsakoder.no/kodeklubben/kodeklubboversikt/">
                  Finn kodeklubb
                </a>
              </li>

              <li>
                <a href="https://www.kidsakoder.no/kodeklubben/">Kodeklubben</a>
              </li>
              <li>
                <a href="https://www.kidsakoder.no/skole/"> Skole </a>
              </li>
              <li>
                <a href="https://www.kidsakoder.no/kodetimen/"> Kodetimen </a>
              </li>
            </ul>
          </div>
          <div className="Clear"></div>
        </div>
      </div>
    );
  }
}
