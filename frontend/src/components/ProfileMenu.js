import "./profileMenu.scss";
import React from "react";

const ProfileMenu = ({ name, email, photo }) => {
  return (
    <div className="profile-container">
      {name}

      {photo ? (
        <img id="avatar" src={photo} alt="user" className="ui avatar image" />
      ) : (
        <i id="user-icon" className="user icon"></i>
      )}
    </div>
  );
};

export default ProfileMenu;
