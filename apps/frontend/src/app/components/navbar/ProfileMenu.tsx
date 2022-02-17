import { FC } from "react";
import { Image, Icon, Button } from "semantic-ui-react";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

type ProfileMenuProps = { name: string; photo: string | undefined };

const ProfileMenu: FC<ProfileMenuProps> = ({ name, photo }) => {
  const navigate = useNavigate();
  const { logoutUser } = useUserContext();
  const logout = () => {
    logoutUser();
    navigate("/logout");
  };

  return (
    <>
      {photo ? (
        <div
          style={{
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image src={photo} size="mini" avatar />
          <span>{name}</span>
        </div>
      ) : (
        <div>
          <Icon name="user" size="large" />
          <span>{name}</span>
        </div>
      )}
    </>
  );
};

export default ProfileMenu;
