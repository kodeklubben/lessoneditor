import "./profileMenu.scss";
import { FC } from "react";

type ProfileMenuProps = { name: string; photo: string };

const ProfileMenu: FC<ProfileMenuProps> = ({ name, photo }) => {
  return (
    <div className="navbar_profile">
      <p>{name}</p>
      {photo ? (
        <img id="avatar" src={photo} alt="user" className="ui avatar image" />
      ) : (
        <i id="user-icon" className="user icon"></i>
      )}
    </div>
  );
};

export default ProfileMenu;
