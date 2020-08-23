import "./profileMenu.scss";
import React from "react";

const ProfileMenu = ({ name, email, photo }) => {
  return (
    <div style={{ marginBottom: "1em" }}>
      <span style={{ position: "relative", left: "-1em" }}>{name}</span>
      {photo ? (
        <img src={photo} alt="user" className="ui avatar image" />
      ) : (
        <i className="user icon"></i>
      )}
    </div>
  );
};

export default ProfileMenu;
