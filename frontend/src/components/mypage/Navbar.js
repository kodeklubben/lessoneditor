import React from "react";
import Logo from "./logo.jpg";

const navContent = [
  {
    href: "https://www.kidsakoder.no/kodeklubben/kodeklubboversikt/",
    text: "Finn kodeklubb"
  },
  { href: "https://oppgaver.kidsakoder.no/", text: "Oppgaver" },
  { href: "https://www.kidsakoder.no/om-lkk/", text: "Om LKK" },
  { href: "#minside", text: "Min side" }
];

function Navbar() {
  return (
    <div>
      <div className="ui massive myNavbar stackable menu">
        <div className=" logo">
          <img alt="" src={Logo} />
        </div>
        <div className="right menu">
          {navContent.map((element, index) => (
            <a key={"element" + index} className="item" href={element.href}>
              {element.text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Navbar;
