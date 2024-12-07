const express = require("express");
const router = express.Router();
const taskRouter = require("./task");
const projectRouter = require("./project");
const userRouter = require("./user");
const authRouter = require("./auth");
const { verifyRole, verifyToken } = require("../middleware/auth");

router.use("/auth", authRouter);
router.use("/tasks", verifyToken, taskRouter);
router.use("/projects", projectRouter);
router.use("/users", verifyToken, userRouter);

module.exports = router;
