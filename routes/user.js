var express = require("express");
var router = express.Router();
const { getUsers, getAllTasks } = require("../controllers/users.controllers");

/**
 * @route GET users
 * @description Get all users with filters/searchs
 * @access public
 */
router.get("/", getUsers);

/**
 * @route GET users/:id/task
 * @description Get all tasks of a user
 * @access public
 * @requiredParam: id
 * @Existence: false
 */
router.get("/:id/task", getAllTasks);

module.exports = router;
