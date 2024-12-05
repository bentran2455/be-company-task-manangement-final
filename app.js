const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const connection = require("./connection/connection");
const indexRouter = require("./routes/index");
const app = express();
const fileUpload = require("express-fileupload");

app.use(
  fileUpload({
    limits: {
      fileSize: 5242880,
      files: 1,
    },
    useTempFiles: true,
    tempFileDir: "/tmp/",
    // debug: true,
    abortOnLimit: true,
    createParentPath: true,
  })
);
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.post("/upload-file", (req, res) => {
  const file = req.files.file;
  console.log(file);
  res.status(200).send("File uploaded");
});

connection();

module.exports = app;
