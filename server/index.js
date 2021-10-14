const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const path = require('path');


const PORT = process.env.PORT || 3001;

const app = express();
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname), 'views');
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost:27017/ride_along', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connection open");
    })
    .catch(err => {
        console.log("Error");
        console.log(err)
    });
app.get('/', (req, res) => {
    res.send("Hello");
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});