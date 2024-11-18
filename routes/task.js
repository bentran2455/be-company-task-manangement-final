var express = require("express");
var router = express.Router();
const { nameExistenceValidator } = require("../validator/tasks.errorHandles");

const {
  createTask,
  getTasks,
  getTaskById,
  updateStatusOfTask,
  deleteTask,
  assignTask,
  unassignTask,
} = require("../controllers/tasks.controllers");

/**
 * @route POST api/tasks
 * @description Create a new task
 * @access public
 * @requiredBody: name, description, status
 * @checkExistence: true
 */
router.post("/", nameExistenceValidator, createTask);

/**
 * @route GET api/tasks
 * @description Get all tasks with filters/searchs
 * @access public
 */
router.get("/", getTasks);

/**
 * @route GET api/tasks/:id
 * @description Get all tasks via id
 * @access public
 * @requiredParam: id
 */
router.get("/:id", getTaskById);

/**
 * @route PUT api/tasks/:id
 * @description Update status of a task
 * @access public
 * @requiredBody: status
 * @requiredParam: id
 * @extraRequirements: When status = done, it can't be changed to other value except archive
 */
router.put("/:id", updateStatusOfTask);

/**
 * @route PATCH api/tasks/:id/assign
 * @description Assign a task to a user
 * @access public
 * @requiredBody: assignee
 * @requiredParam: id
 */
router.patch("/:id/assign", assignTask);

/**
 * @route PATCH api/tasks/:id/unassign
 * @description Unassign a task to a user
 * @access public
 * @requiredParam: id
 */
router.patch("/:id/unassign", unassignTask);

/**
 * @route DELETE api/tasks/:id
 * @description Soft delete a task
 * @access public
 * @requiredParam: id
 */
router.delete("/:id", deleteTask);

module.exports = router;
