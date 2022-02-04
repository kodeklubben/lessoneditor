// import classes from "./Navbar.module.scss";
import "./navbar.scss";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useUserContext } from "../../contexts/UserContext";
import logo from "../../../../src/assets/public/lav_logo.jpg";

const Navbar: FC = (props) => {
  const { state: userState } = useUserContext();
  const navigate = useNavigate();

  const navigateToFrontpage = () => {
    navigate("/");
  };

  if (userState.user) {
    return (
      <>
        <header>
          <div className="navbar_container">
            <div className="navbar_image_container">
              <img className="navbar_logo" src={logo} onClick={navigateToFrontpage}></img>
            </div>
            <div className="navbar_children_container">{props.children}</div>
            <div className="navbar_profilemenu_container">
              <ProfileMenu
                name={userState.user.name || userState.user.username}
                photo={userState.user ? userState.user.photo : ""}
              />
            </div>
          </div>
        </header>
      </>
    );
  } else {
    return <div />;
  }
};

export default Navbar;
