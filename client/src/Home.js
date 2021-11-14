import React from "react";
import "./Home.css";
import Selects from "./Selects";
import RideTable from "./RideTable";
import { useApp } from "./contexts/AppContext";

function Home() {
  const { rides } = useApp();

  return (
    <div className="home">
      <div className="homeHeader">
        <h1>RideALONG</h1>
        <nav>
          <a href="/profile">
            <li>
              <h3>My Rides</h3>
            </li>
          </a>
        </nav>
      </div>

      <Selects />
      <RideTable rows={rides} />
    </div>
  );
}

export default Home;
