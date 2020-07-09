import "./profileMenu.css";
import React, { useContext } from "react";

import { UserContext } from "contexts/UserContext";

const ProfileMenu = ({ name, email }) => {
  const context = useContext(UserContext);
  return (
    <div
      style={{
        display: "flex",
        margin: "10px",
      }}
    >
      <span style={{ margin: "5px", float: "right" }}>{name}</span>
      {context.user ? (
        <img src={context.user.photo} alt="user" className="ui avatar image" />
      ) : (
        <i style={{ margin: "0px", float: "right" }} className="user icon"></i>
      )}
    </div>
  );
};

export default ProfileMenu;
