import "./navbar.scss";
import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useUserContext } from "../../contexts/UserContext";
import logo from "../../../../src/assets/public/lav_logo.jpg";
import logo_mobile from "../../../../src/assets/public/lkk_logo.png";
type Props = {
  children?: React.ReactNode;
};
export const Navbar: FC<Props> = (props) => {
  const { state: userState } = useUserContext();
  const navigate = useNavigate();

  return (
    <nav className="navbar_container">
      <div className="navbar_image_container" onClick={() => navigate("/")}>
        <img className="navbar_logo__desktop" src={logo}></img>
        <img className="navbar_logo__mobile" src={logo_mobile}></img>
      </div>
      <div className="navbar_children_container">{props.children}</div>
      <div className="navbar_profilemenu_container">
        <ProfileMenu
          name={userState.user!.name || userState.user!.username}
          photo={userState.user!.photo}
          email={userState.user?.email}
        />
      </div>
    </nav>
  );
};
