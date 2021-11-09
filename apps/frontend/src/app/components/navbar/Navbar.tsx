import classes from "./Navbar.module.scss";
import { FC } from "react";
import { useHistory } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useUserContext } from "../../contexts/UserContext";
import logo from "../../../../src/assets/public/lav_logo.jpg";

const Navbar: FC = (props) => {
  const { state: userState } = useUserContext();
  const history = useHistory();

  const navigateToFrontpage = () => {
    history.push("/");
  };

  return (
    <>
      <header>
        <div className={classes.container}>
          <div className={classes.image_container}>
            <img className={classes.logo} src={logo} onClick={navigateToFrontpage}></img>
          </div>
          <div className={classes.children_container}>{props.children}</div>
          <div className={classes.profileMenu_container}>
            <ProfileMenu
              name={userState.user ? userState.user.name : ""}
              photo={userState.user ? userState.user.photo : ""}
            />
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
