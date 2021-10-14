const express = require("express");
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const path = require('path');

//mongoatlas password-abcd@1234 username-madhur
const PORT = process.env.PORT || 3001;

const app = express();
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('views', path.join(__dirname), 'views');
app.set('view engine', 'ejs');

const MONGODB_URI = "mongodb+srv://madhur:abcd%401234@ridealong.eyviq.mongodb.net/ridealong?retryWrites=true&w=majority"
mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/ride-along', { useNewUrlParser: true, useUnifiedTopology: true })
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