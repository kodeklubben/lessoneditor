import "./profileMenu.css";
import React from "react";
import { Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
  return (
    <React.Fragment>
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
            <h2>Firstname LastName</h2>
            <p style={{ marginTop: "-1rem" }}>email@email.com</p>
            <Link to="/myPage">
              <h4 style={{ color: "black", textDecoration: "underline" }}>
                Min side
              </h4>
            </Link>
            <div style={{ marginTop: "3rem" }} />
          </div>
        }
      />
    </React.Fragment>
  );
};

export default ProfileMenu;
