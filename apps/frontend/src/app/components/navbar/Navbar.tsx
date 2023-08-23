import "./navbar.scss";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useUserContext } from "../../contexts/UserContext";
import logo from "../../../../src/assets/public/lav_logo.jpg";
import logo_mobile from "../../../../src/assets/public/lkk_logo.png";

const Navbar: FC<{ children?: ReactNode }> = ({ children }) => {
  const { state: userState } = useUserContext();
  const navigate = useNavigate();

  const navigateToFrontpage = () => {
    navigate("/");
  };

  const username = userState.user?.name || userState.user?.username || "";
  const userphoto = userState.user?.photo;
  const useremail = userState.user?.email;

  return (
    <nav className="navbar_container">
      <div className="navbar_image_container" onClick={navigateToFrontpage}>
        <img className="navbar_logo__desktop" src={logo} alt="Logo desktop"></img>
        <img className="navbar_logo__mobile" src={logo_mobile} alt="Logo mobile"></img>
      </div>
      <div className="navbar_children_container">{children}</div>
      <div className="navbar_profilemenu_container">
        <ProfileMenu name={username} photo={userphoto} email={useremail} />
      </div>
    </nav>
  );
};

export default Navbar;
