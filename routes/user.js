var express = require("express");
var router = express.Router();
const {
  createUser,
  getUsers,
  getAllTasks,
} = require("../controllers/users.controllers");
const { nameExistenceValidator } = require("../validator/users.errorHandles");

/**
 * @route POST api/users
 * @description Create a new user
 * @access public
 * @requiredBody: name
 * @checkExistence: true
 */
router.post("/", nameExistenceValidator, createUser);

/**
 * @route GET api/users
 * @description Get all users with filters/searchs
 * @access public
 */
router.get("/", getUsers);

/**
 * @route GET api/users/:id/task
 * @description Get all tasks of a user
 * @access public
 * @requiredParam: id
 * @Existence: false
 */
router.get("/:id/task", getAllTasks);

module.exports = router;
