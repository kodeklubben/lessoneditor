import { FC } from "react";
import { Image, Icon } from "semantic-ui-react";

type ProfileMenuProps = { name: string; photo: string };

const ProfileMenu: FC<ProfileMenuProps> = ({ name, photo }) => {
  return (
    <>
      {photo ? (
        <div>
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
