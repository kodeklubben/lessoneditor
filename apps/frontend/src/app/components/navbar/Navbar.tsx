import "./navbar.scss";
import { FC, ReactNode } from "react";
import { useNavigate } from "react-router";
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

  const username = userState?.user?.name || userState?.user?.username || "";
  const userphoto = userState?.user?.photo || "";
  const useremail = userState?.user?.email || "";

  return (
    <nav className="navbar_container">
      <a
        className="navbar_image_container"
        href="/"
        aria-label="Lær Kidsa Koding – til forsiden"
        onClick={(event) => {
          event.preventDefault();
          navigateToFrontpage();
        }}
      >
        <img className="navbar_logo__desktop" src={logo} alt=""></img>
        <img className="navbar_logo__mobile" src={logo_mobile} alt=""></img>
      </a>
      <div className="navbar_children_container">{children}</div>
      <div className="navbar_profilemenu_container">
        {userState?.user && <ProfileMenu name={username} photo={userphoto} email={useremail} />}
      </div>
    </nav>
  );
};

export default Navbar;
