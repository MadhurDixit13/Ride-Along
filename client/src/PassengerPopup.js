import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import axios from "./axios";

function PassengerPopup({ open, handleClose, info }) {
  async function handleCancel() {
    try {
      await axios.patch(
        `/ride/${info}`,
        { cancelRequest: true },
        { headers: { authorization: localStorage.getItem("token") } }
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
      <DialogTitle id="alert-dialog-title">Cancel</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to cancel your request?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={handleCancel} color="primary" autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PassengerPopup;
