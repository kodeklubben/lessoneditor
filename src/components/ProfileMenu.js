import React from "react";
import { connect } from "react-redux";
import { Popup } from "semantic-ui-react";
import GoogleAuth from "./GoogleAuth";

const ProfileMenu = props => {
  return (
    <React.Fragment>
      <Popup
        className="transition hidden"
        basic
        hover
        size="tiny"
        trigger={
          <div className="ui avatar image">
            {props.imageUrl ? (
              <img src={props.imageUrl} alt="useImage"></img>
            ) : (
              <div className="ui avatar image">
                <i className="user icon"></i>
              </div>
            )}
          </div>
        }
        position="bottom center"
        on="click"
        style={{
          backgroundColor: "rgba(0,0,0,0.0)",
          border: "none",
          borderColoer: "rgba(0,0,0,0.0)",
          width: "14vh"
        }}
        pinned
        content={
          <div style={{ position: "left" }}>
            <GoogleAuth />
          </div>
        }
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    imageUrl: state.auth.imageUrl
  };
};
export default connect(mapStateToProps)(ProfileMenu);
