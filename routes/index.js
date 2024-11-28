const express = require("express");
const router = express.Router();
const taskRouter = require("./task");
const userRouter = require("./user");
const authRouter = require("./auth");

router.use("/auth", authRouter);
router.use("/tasks", taskRouter);
router.use("/users", userRouter);

module.exports = router;
