var express = require("express");
var router = express.Router();
var taskRouter = require("./task");
var userRouter = require("./user");

router.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

router.use("/task", taskRouter);
router.use("/user", userRouter);

module.exports = router;
