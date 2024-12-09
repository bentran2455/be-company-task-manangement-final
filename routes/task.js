var express = require("express");
var router = express.Router();
const { nameExistenceValidator } = require("../validator/tasks.errorHandles");

const {
  createTask,
  getTasks,
  getTasksOfProject,
  updateTask,
  deleteTask,
} = require("../controllers/tasks.controllers");

router.post("/", nameExistenceValidator, createTask);

router.get("/", getTasks);

router.get("/project/:id", getTasksOfProject);

router.put("/:id", updateTask);

router.delete("/:id", deleteTask);

module.exports = router;
