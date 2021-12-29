const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  pickup: {
    type: String,
    required: true,
  },
  dropoff: {
    type: String,
    required: true,
  },
  pickupTime: {
    type: Date,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  riders: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
  requested: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model("Ride", rideSchema);