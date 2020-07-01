import "./profileMenu.css";
import React from "react";
import { Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";

const ProfileMenu = ({ name, email }) => {
  return (
    <>
      <Popup
        className="transition hidden"
        basic
        hover
        size="tiny"
        trigger={
          <div>
            <i className="user icon"></i>
          </div>
        }
        position="bottom center"
        on="click"
        style={{}}
        pinned
        content={
          <div
            style={{
              position: "left",
              borderRadius: "5px",
            }}
          >
            <div className="ui ">
              <div className="ui circular centered image">
                <i className="user icon"></i>
              </div>
            </div>
            <div style={{ marginTop: "1rem" }} />
            <h2>{name}</h2>
            <p style={{ marginTop: "-1rem" }}>{email}</p>
            <Link to="/myPage">
              <h4 style={{ color: "black", textDecoration: "underline" }}>
                Min side
              </h4>
            </Link>
            <div style={{ marginTop: "3rem" }} />
          </div>
        }
      />
    </>
  );
};

export default ProfileMenu;
