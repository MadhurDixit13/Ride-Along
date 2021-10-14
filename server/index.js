const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const path = require('path');


const PORT = process.env.PORT || 3001;

const app = express();
mongoose.connect('mongodb://localhost:27017/Ride_Along', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection open");
    })
    .catch(err => {
        console.log("Error");
        console.log(err)
    });
app.get('/', (req, res) => {
    res.send("YO");
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});