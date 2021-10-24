import React, { useState } from "react";
import axios from "./axios";
import Select from "react-select";
import { useApp } from "./contexts/AppContext";
import CreateForm from "./CreateForm";
import "./Selects.css";

const customStyles = {
  container: (provided) => ({
    ...provided,
    border: "3px solid #FE8F8F",
    borderRadius: "5px",
  }),
  control: () => ({
    display: "flex",
  }),
  option: (provided, state) => ({
    ...provided,
    "&:hover": {
      backgroundColor: "var(--special)",
    },
    backgroundColor: state.isSelected && "var(--special)",

    fontSize: "0.75rem",
  }),
  input: (provided) => ({
    ...provided,
    width: "100%",
  }),
};

function Selects() {
  const [role, setRole] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const { setRides } = useApp();

  async function handleSearch() {
    const res = await axios.get("/ride", {
      headers: { authorization: localStorage.getItem("token") },
      params: { pickup: pickup.value, dropoff: dropoff.value },
    });
    setRides(res.data);
  }

  return (
    <div className="selectContainer">
      <Select
        onChange={setRole}
        className="role"
        styles={customStyles}
        defaultValue={{ value: "rider", label: "Rider" }}
        options={[
          { value: "rider", label: "Rider" },
          { value: "driver", label: "Driver" },
        ]}
      />
      <Select
        onChange={setPickup}
        className="pickup"
        styles={customStyles}
        options={[
          { value: "", label: "None" },
          { value: "Churchgate", label: "Churchgate" },
          { value: "Thane", label: "Thane" },
          { value: "Navi Mumbai", label: "Navi Mumbai" },
          { value: "Bandra", label: "Bandra" },
          { value: "Vasai", label: "Vasai" },
          { value: "Powai", label: "Powai" },
          { value: "Ghatkopar", label: "Ghatkopar" },
          { value: "Fort", label: "Fort" },
          { value: "Borivali", label: "Borivali" },
          { value: "Marine Lines", label: "Marine Lines" },
        ]}
      />
      <Select
        onChange={setDropoff}
        className="dropoff"
        styles={customStyles}
        options={[
          { value: "", label: "None" },
          { value: "Churchgate", label: "Churchgate" },
          { value: "Thane", label: "Thane" },
          { value: "Navi Mumbai", label: "Navi Mumbai" },
          { value: "Bandra", label: "Bandra" },
          { value: "Vasai", label: "Vasai" },
          { value: "Powai", label: "Powai" },
          { value: "Ghatkopar", label: "Ghatkopar" },
          { value: "Fort", label: "Fort" },
          { value: "Borivali", label: "Borivali" },
          { value: "Marine Lines", label: "Marine Lines" },
        ]}
      />
      {role.value === "driver" ? (
        <CreateForm pickup={pickup.value} dropoff={dropoff.value} />
      ) : (
        <div>
          <button className="searchBtn" onClick={handleSearch}>
            SEARCH<span class="material-icons-outlined">search</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default Selects;
