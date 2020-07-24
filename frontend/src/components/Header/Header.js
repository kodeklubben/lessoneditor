import React from "react";
import Logo from "./logo.jpg";
import "./Header.css";

function Header() {
  return (
    <div>
      <div className="ui massive myNavbar stackable menu">
        <div className=" logo">
          <img alt="" src={Logo} />
        </div>
        <div className="right menu ">
          <div className="mg">
            <i className="big user circle icon"></i>
            <span>User name</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Header;
