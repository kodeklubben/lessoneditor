import "./profileMenu.css";
import React, { useContext } from "react";
import { Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { UserContext } from "contexts/UserContext";

const ProfileMenu = ({ name, email }) => {
  const context = useContext(UserContext);
  return (
    <>
      <Popup
        className="transition hidden"
        basic
        hover
        size="tiny"
        trigger={
          <div
            style={{
              display: "flex",
              margin: "10px",
            }}
          >
            <span style={{ margin: "5px", float: "right" }}>{name}</span>
            {context.user.photo ? (
              <img
                src={context.user.photo}
                alt="user"
                className="ui avatar image"
              />
            ) : (
              <i
                style={{ margin: "0px", float: "right" }}
                className="user icon"
              ></i>
            )}
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
                {context.user.photo ? (
                  <img src={context.user.photo} alt="user" />
                ) : (
                  <i className="home icon"></i>
                )}
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
