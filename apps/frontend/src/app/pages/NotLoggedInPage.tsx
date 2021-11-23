import React,{useEffect} from "react";

const NotLoggedInPage: React.FC = () => {

  useEffect(() => {
    window.location.href = "http://localhost:4200/api/auth/login/";
  })

  return (
    <>
    </>
  );
};

export default NotLoggedInPage;
