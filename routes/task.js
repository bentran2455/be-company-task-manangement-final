var express = require("express");
var router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
} = require("../controllers/tasks.controllers");

router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);

//Assign a task to a user or unassign them
//Update the status of a task. when the status is set to done, it can't be changed to other value except archive
//Soft delete a task
//Research and Apply: Research on express-validator and apply further API request input control:
// All routes that require _id , must be checked for its existence and whether it is a mongo object id.

module.exports = router;
