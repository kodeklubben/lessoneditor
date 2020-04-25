import React from "react";
import { connect } from "react-redux";

const ProfileMenu = props => {
  return (
    <React.Fragment>
      <div className="ui avatar image">
        {props.imageUrl ? (
          <img src={props.imageUrl} alt="useImage"></img>
        ) : (
          <i className="user icon"></i>
        )}
      </div>
    </React.Fragment>
  );
};

const mapStateToProps = state => {
  return {
    imageUrl: state.auth.imageUrl
  };
};
export default connect(mapStateToProps)(ProfileMenu);
