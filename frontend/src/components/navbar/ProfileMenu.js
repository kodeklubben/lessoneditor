import "./profileMenu.scss";
import React from "react";

const ProfileMenu = ({ name, photo }) => {
  return (
    <div style={{ marginBottom: "1em", marginLeft: "1em" }}>
      <span style={{ position: "relative", left: "-1em" }}>{name}</span>
      {photo ? (
        <img
          style={{ marginLeft: "-0.7em", marginTop: "-1px" }}
          id="avatar"
          src={photo}
          alt="user"
          className="ui avatar image"
        />
      ) : (
        <i
          style={{ marginLeft: "-0.7em", marginTop: "0.4em" }}
          id="user-icon"
          className="user icon"
        ></i>
      )}
    </div>
  );
};

export default ProfileMenu;
