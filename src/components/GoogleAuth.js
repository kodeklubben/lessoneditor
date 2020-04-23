import React from "react";
import { connect } from "react-redux";
import { signIn, signOut } from "../actions";

var profile = null;

class GoogleAuth extends React.Component {
  componentDidMount() {
    window.gapi.load("client:auth2", async () => {
      await window.gapi.client
        .init({
          clientId:
            "761801565638-d9i95vs7s4hrgo6u542taddpo66hrf04.apps.googleusercontent.com",
          scope: "email"
        })
        .then(async () => {
          this.auth = await window.gapi.auth2.getAuthInstance();
          profile = await this.auth.currentUser.get().getBasicProfile();
          this.onAuthChange(await this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = isSignedIn => {
    if (isSignedIn) {
      this.props.signIn(
        profile.getId(),
        profile.getGivenName(),
        profile.getFamilyName(),
        profile.getImageUrl(),
        profile.getEmail()
      );
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };

  renderAuthButton() {
    if (this.props.isSignedIn === null) {
      return null;
    } else if (this.props.isSignedIn) {
      return (
        <button onClick={this.onSignOutClick} className="ui red google button">
          <i className="google icon" />
          Logg ut
        </button>
      );
    } else {
      return (
        <button onClick={this.onSignInClick} className="ui red google button">
          <i className="google icon" />
          Logg inn med Google
        </button>
      );
    }
  }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = state => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, { signIn, signOut })(GoogleAuth);
