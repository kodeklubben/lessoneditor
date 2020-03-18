import React from 'react';
import "./NavbarStyle.css";
import Logo from './logo.jpg';


function Navbar(){
  return (
    <div>
      <div className = "navbar-container">
          <div className = "logo">
              <img src={Logo} />
          </div>
          <div className = "navbar">
          <ul >
              <li > < a href = "https://www.kidsakoder.no/kodeklubben/kodeklubboversikt/" > Finn kodeklub </a></li >
              <li > < a href = "https://www.kidsakoder.no/nyheter/" > Oppgaver </a></li >
              <li > < a href = "https://www.kidsakoder.no/om-lkk/" > Hjem </a></li >
              <li > < a href = "#minside" > Min side </a></li >
              </ul>
              </div>
              <div className = "line">
              
              </div>
        </div>
    </div>
      )
}
export default Navbar;
