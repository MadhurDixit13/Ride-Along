import React, { useState } from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { Avatar, Tab, Tabs } from "@material-ui/core";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import { EventSeat } from "@material-ui/icons";
import "./Profile.css";
import PassengerPopup from "./PassengerPopup";

function Passenger({ joined, requested }) {
  const [value, setValue] = useState(0);
  const [info, setInfo] = useState();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function handleOpen(id) {
    setInfo(id);
    setOpen(true);
  }
  return (
    <div>
      <PassengerPopup open={open} handleClose={handleClose} info={info} />
      <Tabs
        className="passengerTabs"
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
        style={{ marginLeft: "0.5em" }}
      >
        <Tab label="Joined" icon={<EventSeat />} />
        <Tab label="Requested" icon={<AnnouncementIcon />} />
      </Tabs>

      <div value={value} hidden={value !== 0}>
        {joined.length === 0 && (
          <p className="placeholderContent">
            You will see rides that you have joined here!
          </p>
        )}
        {joined &&
          joined.map((ride) => (
            <div className="myRideContainer" key={ride._id}>
              <div className="myRide">
                <h4>
                  {new Date(ride.pickupTime).toLocaleString("en-SG", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </h4>
                {`${ride.pickup} to ${ride.dropoff}`}
              </div>
              {ride.riders.map((rider) => (
                <Tooltip key={rider._id} title={rider.username} placement="top">
                  <Avatar
                    alt={rider.username}
                    src={`/image/${rider.profileImageName}`}
                  />
                </Tooltip>
              ))}
            </div>
          ))}
      </div>
      <div value={value} hidden={value !== 1}>
        {requested.length === 0 && (
          <p className="placeholderContent">
            You will see your requested rides here!
          </p>
        )}
        {requested &&
          requested.map((ride) => (
            <div className="myPassengerContainer" key={ride._id}>
              <div className="myRide">
                <h4>
                  {new Date(ride.pickupTime).toLocaleString("en-SG", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </h4>
                {`${ride.pickup} to ${ride.dropoff}`}
              </div>
              {ride.riders.map((rider) => (
                <Tooltip key={rider._id} title={rider.username} placement="top">
                  <Avatar
                    alt={rider.username}
                    src={`/image/${rider.profileImageName}`}
                  />
                </Tooltip>
              ))}
              <button onClick={() => handleOpen(ride._id)}>CANCEL</button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Passenger;
