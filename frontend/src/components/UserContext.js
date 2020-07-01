import React, { useEffect, useState } from "react";
import axios from "axios";

export const UserContext = React.createContext({});

export const UserContextProvider = (props) => {
  const [user, setUser] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/current-user");
      setUser(res.data);
    }
    fetchData();
  }, []);
  return (
    <>
      <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
    </>
  );
};
