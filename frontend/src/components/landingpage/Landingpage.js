import "./landingpage.scss";
import React from "react";
import { useParams } from "react-router";
import Navbar from "components/navbar/Navbar";
import Datapanel from "./datapanel/Datapanel";

const Landingpage = () => {
  const { course } = useParams();

  return (
    <>
      <Navbar />
      <div style={{ display: "flex" }}>
        <div
          style={{ justifyContent: "center", alignItems: "center" }}
          className="landing_navbar"
        >
          {course}
        </div>
      </div>
      <Datapanel />
    </>
  );
};

export default Landingpage;
