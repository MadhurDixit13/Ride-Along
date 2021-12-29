import React, { useState } from "react";
import axios from "./axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { Avatar } from "@material-ui/core";
import { useAuth } from "./contexts/AuthContext";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

function RideTable({ rows }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [info, setInfo] = useState({});
  const { currentUser } = useAuth();

  const handleClickOpen = (
    id,
    username,
    pickup,
    dropoff,
    time,
    price,
    seats,
    hobby,
    riders
  ) => {
    setInfo({
      id: id,
      username: username,
      pickup: pickup,
      dropoff: dropoff,
      time: new Date(time).toLocaleString("en-SG"),
      price: price,
      seats: seats,
      hobby: hobby,
      riders: riders,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function RidePopup({ info }) {
    async function handleSendRequest() {
      try {
        await axios.patch(
          `/ride/${info.id}`,
          { sendRequest: true },
          {
            headers: {
              authorization: localStorage.getItem("token"),
            },
          }
        );
        handleClose();
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
        <DialogTitle id="alert-dialog-title">
          {`Request to join ${info.username}'s ride?`}
        </DialogTitle>
        <DialogContent>
          <div>{`${info.pickup} to ${info.dropoff}`}</div>
          <div style={{ display: "flex" }}>{info.time}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span>Price: ${info.price}</span>
            <span>Seats left: {info.seats}</span>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          {info.riders &&
            !info.riders
              .reduce((a, b) => a.concat(b._id), [])
              .includes(currentUser) && (
              <Button onClick={handleSendRequest} color="primary" autoFocus>
                Send Request
              </Button>
            )}
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <TableContainer component={Paper}>
      <RidePopup info={info} />
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Driver</TableCell>
            <TableCell>Pickup</TableCell>
            <TableCell>Dropoff</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Hobby</TableCell>
            <TableCell>Riders</TableCell>
          </TableRow>
        </TableHead>
        <TableBody style={{ cursor: "pointer" }}>
          {rows.map((row) => (
            <TableRow
              key={row._id}
              onClick={() =>
                handleClickOpen(
                  row._id,
                  row.ownerId.username,
                  row.pickup,
                  row.dropoff,
                  row.pickupTime,
                  row.price,
                  row.hobby,
                  row.seats,
                  row.riders
                )
              }
            >
              <TableCell component="th" scope="row">
                <Avatar
                  alt={row.ownerId.username}
                  src={`/image/${row.ownerId.profileImageName}`}
                />
              </TableCell>
              <TableCell>{row.pickup}</TableCell>
              <TableCell>{row.dropoff}</TableCell>
              <TableCell>
                {new Date(row.pickupTime).toLocaleString("en-SG").split(",")[0]}
              </TableCell>
              <TableCell>
                {new Date(row.pickupTime).toLocaleTimeString("en-SG", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>${row.price}</TableCell>
              <TableCell>{info.hobby}</TableCell>
              <TableCell>
                <div style={{ display: "flex" }}>
                  {row.riders.map((rider) => (
                    <Avatar
                      alt={rider.username}
                      key={rider._id}
                      src={`/image/${rider.profileImageName}`}
                    />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RideTable;
