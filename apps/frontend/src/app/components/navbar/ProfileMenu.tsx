import { FC } from "react";
import { Image, Icon, Button, Popup } from "semantic-ui-react";
import { useUserContext } from "../../contexts/UserContext";
import { useNavigate } from "react-router";

type ProfileMenuProps = { name: string; photo?: string | undefined; email?: string | undefined };

const ProfileMenu: FC<ProfileMenuProps> = ({ name, photo, email }) => {
  const navigate = useNavigate();
  const { logoutUser } = useUserContext();
  const logout = () => {
    logoutUser();
    navigate("/logout");
  };

  return (
    <>
      {photo ? (
        <>
          <div
            style={{
              display: "flex",
              flexFlow: "row nowrap",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Popup
              wide
              header={name}
              content={
                <div>
                  {email ? <h4 style={{ color: "gray" }}>{email}</h4> : ""}
                  <Button color="red" style={{ marginLeft: "2em" }} onClick={logout}>
                    Logg ut
                  </Button>
                </div>
              }
              trigger={
                <button
                  type="button"
                  className="navbar_profile_button"
                  aria-label={`Profilmeny for ${name}`}
                  style={{ background: "none", border: 0, padding: 0, cursor: "pointer" }}
                >
                  <Image className="navbar_image" src={photo} size="mini" avatar alt="" />
                </button>
              }
              on="click"
            />
          </div>
        </>
      ) : (
        <>
          <div>
            <Icon name="user" size="large" />
            <span>{name}</span>
          </div>
          <Button onClick={logout}>Logg ut</Button>
        </>
      )}
    </>
  );
};

export default ProfileMenu;
