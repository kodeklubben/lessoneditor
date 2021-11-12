import React from "react";

const NotLoggedInPage: React.FC = () => {
  return (
    <div className="PreviewArea">
      <h1>Du er ikke logget inn.</h1>
      <p>
        <a href="/api/auth/login/">Trykk her for å logge inn</a>:
      </p>
    </div>
  );
};

export default NotLoggedInPage;
