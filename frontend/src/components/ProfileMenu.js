import "./profileMenu.css";
import React from "react";

const ProfileMenu = ({ name, email, photo }) => {
  return (
    <div
      style={{
        display: "flex",
        margin: "10px",
      }}
    >
      <span style={{ margin: "auto", float: "right" }}>{name}</span>
      {photo ? (
        <img src={photo} alt="user" className="ui avatar image" />
      ) : (
        <i style={{ margin: "0px", float: "right" }} className="user icon"></i>
      )}
    </div>
  );
};

export default ProfileMenu;
