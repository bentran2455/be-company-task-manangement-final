var express = require("express");
var router = express.Router();
var taskRouter = require("./task");
var userRouter = require("./user");

router.get("/", (req, res) => {
  res.sendFile("index.html", { root: "./public" });
});

router.use("/tasks", taskRouter);
router.use("/users", userRouter);

module.exports = router;
