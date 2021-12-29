const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const path = require("path");
const crypto = require("crypto");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

//cors parser middleware
app.use(cors());
app.use(express.json());

//connect to db
mongoose.connect(
  process.env.REACT_APP_DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => console.log("Connected to DB")
);
const conn = mongoose.connection;
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  // gfs = Grid(conn.db, mongoose.mongo);
  // gfs.collection("uploads");
});

//storage engine
const storage = new GridFsStorage({
  url: process.env.REACT_APP_DB_CONNECT,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png")
          return reject("Only images allowed");
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

//multer middleware
const upload = multer({
  storage
});

//import routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

//use auth route
app.use("/user", authRoute);
app.use("/ride", userRoute);

//use auth middleware
const verifyToken = require("./middleware/verifyToken");

//@route POST /upload
app.post("/image/upload", [verifyToken, upload.single("file")], (req, res) => {
  res.json({
    file: req.file
  });
});

// GET /image/:filename
app.get("/image/:filename", (req, res) => {
  gfs.find({
    filename: req.params.filename
  }).toArray((err, file) => {
    // Check if file
    if (!file[0] || file.length[0] === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }
    // Check if image
    if (
      file[0].contentType === "image/jpeg" ||
      file[0].contentType === "image/png"
    ) {
      // Read output to browser
      const readstream = gfs.openDownloadStreamByName(file[0].filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

//DELETE profileImage
app.delete("/image/:imageId", verifyToken, (req, res) => {
  gfs.delete(new mongoose.Types.ObjectId(req.params.imageId), (err, data) => {
    if (err) return res.status(404).json({
      err: err
    });
  });
});

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => console.log(`Server running on port ${port}`));