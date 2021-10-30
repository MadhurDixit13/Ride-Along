import axios from "../axios";
import React, { useContext, useState, useEffect } from "react";

const AppContext = React.createContext();

export function useApp() {
  return useContext(AppContext);
}

export function AppProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    async function getRides() {
      const res = await axios.get("/ride", {
        headers: { authorization: localStorage.getItem("token") },
      });
      setRides(res.data);
    }
    getRides();
    setLoading(false);
  }, []);

  const value = {
    rides,
    setRides,
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
}
