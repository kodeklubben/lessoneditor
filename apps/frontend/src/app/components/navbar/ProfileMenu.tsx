import { FC } from "react";
import { Image, Icon, Button } from "semantic-ui-react";
import { useUserContext } from "../../contexts/UserContext";

type ProfileMenuProps = { name: string; photo: string | undefined };

const ProfileMenu: FC<ProfileMenuProps> = ({ name, photo }) => {

  const { logoutUser } = useUserContext();
  return (
    <>
      {photo ? (
        <div>
          <Image src={photo} size="mini" avatar />
          <span>{name}</span>
          <Button
          basic
          style={{ margin: "2em", height: "2em", padding: "0 1em 0 1em" }}
          id="next"
          size="big"
          content="Logout"
          onClick={() => logoutUser()}
          />

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
