import React, { useEffect } from "react";

const NotLoggedInPage: React.FC = () => {
  useEffect(() => {
    window.location.href = "http://localhost:4200/api/auth/login/";
  });

  return (
    <>
      <a href="api/auth/login">Log inn her</a>
    </>
  );
};

export default NotLoggedInPage;
