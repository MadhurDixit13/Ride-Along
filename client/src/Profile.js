import axios from "./axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import Passenger from "./Passenger";
import "./Profile.css";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { Avatar } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import AnnouncementIcon from "@material-ui/icons/Announcement";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import Tooltip from "@material-ui/core/Tooltip";
import DriveEtaIcon from "@material-ui/icons/DriveEta";

function Profile() {
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({});
  const handleClickOpen = (id, idx, riders, requested, active) => {
    setInfo({
      id: id,
      idx: idx,
      riders: riders,
      requested: requested,
      active: active,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function ProfilePopup({ info }) {
    async function handleAccept(id) {
      try {
        await axios.patch(
          `/ride/${info.id}`,
          { id: id, acceptRequest: true },
          { headers: { authorization: localStorage.getItem("token") } }
        );
        if (info.active) {
          const copy = activeCreatedRides.slice();
          copy[info.idx].requested = copy[info.idx].requested.map((item) => {
            if (item._id === id)
              return {
                ...item,
                text: `You have accepted ${item.username}'s request`,
              };
            return item;
          });
          setActiveCreatedRides(copy);
        }
        const reqCopy = info.requested.map((item) => {
          if (item._id === id)
            return {
              ...item,
              text: `You have accepted ${item.username}'s request`,
            };
          return item;
        });
        setInfo((prev) => ({ ...prev, requested: reqCopy }));
      } catch (err) {
        console.error(err);
      }
    }
    async function handleDecline(id) {
      try {
        await axios.patch(
          `/ride/${info.id}`,
          { id: id, declineRequest: true },
          { headers: { authorization: localStorage.getItem("token") } }
        );
        if (info.active) {
          const copy = activeCreatedRides.slice();
          copy[info.idx].requested = copy[info.idx].requested.map((item) => {
            if (item._id === id)
              return {
                ...item,
                text: `You have declined ${item.username}'s request`,
              };
            return item;
          });
          setActiveCreatedRides(copy);
        }
        const reqCopy = info.requested.map((item) => {
          if (item._id === id)
            return {
              ...item,
              text: `You have declined ${item.username}'s request`,
            };
          return item;
        });
        setInfo((prev) => ({ ...prev, requested: reqCopy }));
      } catch (err) {
        console.error(err);
      }
    }
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Requests`}</DialogTitle>
        <DialogContent style={{ minWidth: "200px" }}>
          {info.requested && info.requested.length === 0 && <p>No requests</p>}
          {info.requested &&
            info.requested.map((req, idx) => {
              return req.text ? (
                <p className="profilePopup" key={idx}>
                  {req.text}
                </p>
              ) : (
                <div key={req._id} className="profilePopup">
                  <p style={{ marginRight: "2em" }}>{req.username}</p>

                  <IconButton onClick={() => handleAccept(req._id)}>
                    <CheckIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDecline(req._id)}>
                    <ClearIcon />
                  </IconButton>
                </div>
              );
            })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  const [historyRides, setHistoryRides] = useState([]);
  const [activeCreatedRides, setActiveCreatedRides] = useState([]);
  const [activeJoinedRides, setActiveJoinedRides] = useState([]);
  const [activeRequestedRides, setActiveRequestedRides] = useState([]);
  const [photo, setPhoto] = useState("");
  const [value, setValue] = useState(0);
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // get invisible input
  function handleEditPicture() {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  }
  // upload image to db
  async function handleImageChange(event) {
    try {
      const image = event.target.files[0];
      if (image) {
        let data = new FormData();
        data.append("file", image, image.name);
        const res = await axios.post("/image/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: localStorage.getItem("token"),
          },
        });
        //update USER object with image/filename & image/ID
        const oldId = await axios.patch(
          `/user/${currentUser}`,
          {
            profileImageName: res.data.file.filename,
            profileImageId: res.data.file.id,
          },
          {
            headers: { authorization: localStorage.getItem("token") },
          }
        );
        setPhoto(`image/${res.data.file.filename}`);
        if (oldId.data.prevId) {
          await axios.delete(`image/${oldId.data.prevId}`, {
            headers: { authorization: localStorage.getItem("token") },
          });
        }
      }
    } catch (err) {
      setError(true);
    }
  }

  useEffect(() => {
    async function getMyRides() {
      try {
        const now = new Date().toISOString();
        const res = await axios.get(`/user/${currentUser}/ride`, {
          headers: {
            authorization: localStorage.getItem("token"),
          },
        });
        setActiveCreatedRides(
          res.data.filter(
            (ride) => ride.pickupTime > now && ride.ownerId === currentUser
          )
        );
        setActiveJoinedRides(
          res.data.filter(
            (ride) =>
              ride.pickupTime > now &&
              ride.riders.some((item) => item._id === currentUser)
          )
        );
        setActiveRequestedRides(
          res.data.filter(
            (ride) =>
              ride.pickupTime > now &&
              ride.requested.some((item) => item._id === currentUser)
          )
        );
        setHistoryRides(
          res.data.filter(
            (ride) =>
              ride.pickupTime < now &&
              ride.riders.some((item) => item._id === currentUser)
          )
        );
      } catch (err) {
        console.error(err);
      }
    }
    async function getPhoto() {
      try {
        const res = await axios.get(`/user/${currentUser}/image`, {
          headers: { authorization: localStorage.getItem("token") },
        });
        setPhoto(`image/${res.data.profileImageName}`);
      } catch (err) {
        console.error(err);
      }
    }
    getMyRides();
    getPhoto();
  }, [currentUser]);

  const handleErrorClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };
  return (
    <div className="profile">
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <p>Failed to update profile picture.</p>
      </Snackbar>
      <ProfilePopup info={info} />
      <div className="profileHeader">
        <a href="/home"><h3>RideALONG</h3></a>
        <h1>My Rides</h1>
        {/* <Tooltip title="Change profile picture" placement="bottom">
          <Avatar onClick={handleEditPicture} src={`/${photo}`} alt="" />
        </Tooltip> */}
        <a href="/logout"><button className="searchBtn">Logout</button></a>
        <form encType="multipart/form-data" style={{ display: "none" }}>
          <input
            type="file"
            id="imageInput"
            name="avatar"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </form>
      </div>
      <Tabs
        indicatorColor="primary"
        value={value}
        onChange={handleChange}
        aria-label="simple tabs example"
        style={{ marginLeft: "0.5em" }}
      >
        <Tab color="primary" label="Active Rides" />
        <Tab label="History" />
      </Tabs>
      <div className="profileContent" value={value} hidden={value !== 0}>
        <div className="profileSubheader">
          <h4>Created</h4>
          <DriveEtaIcon />
        </div>
        {activeCreatedRides.length === 0 && (
          <p className="placeholderContent">
            You have not created any new rides.
          </p>
        )}
        {activeCreatedRides.map((ride, idx) => (
          <div className="myRideContainer" key={ride._id}>
            <div
              className="myRide"
              onClick={() =>
                handleClickOpen(
                  ride._id,
                  idx,
                  ride.riders,
                  ride.requested,
                  true
                )
              }
            >
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
            {ride.requested.length !== 0 && <AnnouncementIcon />}
          </div>
        ))}
        <Passenger
          joined={activeJoinedRides}
          requested={activeRequestedRides}
        />
      </div>
      <div className="profileContent" value={value} hidden={value !== 1}>
        {historyRides.length === 0 && (
          <p className="placeholderContent">No previous rides.</p>
        )}
        {historyRides.map((ride, idx) => (
          <div className="myRideContainer" key={ride._id}>
            <div className="myRide">
              <h4>{new Date(ride.pickupTime).toLocaleString("en-SG")}</h4>
              {`${ride.pickup} to ${ride.dropoff}`}
            </div>
            {ride.riders.map((rider) => (
              <Tooltip key={rider._id} title={rider.username} placement="top">
                <Avatar
                  alt={rider.username}
                  key={rider._id}
                  src={`/image/${rider.profileImageName}`}
                />
              </Tooltip>
            ))}
            {ride.requested.length !== 0 && <AnnouncementIcon />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
