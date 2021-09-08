import "./navbar.scss";
import { FC } from "react";
import { useHistory } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import { useUserContext } from "../../contexts/UserContext";
import { Menu, Image } from "semantic-ui-react";
import logo from "/assets/public/lav_logo.jpg";

const Navbar: FC = () => {
  const { user } = useUserContext();
  const history = useHistory();

  const navigateToFrontpage = () => {
    history.push("/");
  };

  return (
    <>
      <Menu pointing secondary>
        <Menu.Item header>
          <Image src={logo} size="small" onClick={navigateToFrontpage} />
        </Menu.Item>
        <Menu.Item position="right">
          <ProfileMenu name={user ? user.name : ""} photo={user ? user.photo : ""} />
        </Menu.Item>
      </Menu>
    </>
  );
};

export default Navbar;
