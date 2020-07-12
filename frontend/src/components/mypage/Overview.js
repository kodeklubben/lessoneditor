import React, { useContext } from "react";
import "./OverviewStyle.css";

// import Navbar from "./Navbar";
import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";

const Overview = () => {
  const context = useContext(UserContext);
  const { lessons } = context.user;
  return (
    <div>
      {/* <Navbar /> */}
      {lessons ? (
        <div className="OverviewBox">
          <div className="ui stackable four column grid">
            <div className="row">
              <div className="ten wide column">
                <ItemList items={lessons} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <b>Du har ingen kurs</b>
      )}
      <br />

      <a href={"/new-lesson"}>
        <button className="ui button">Ny Oppgave</button>
      </a>
    </div>
  );
};
export default Overview;
