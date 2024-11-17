var express = require("express");
var router = express.Router();
const {
  createUser,
  getUsers,
  getUserByName,
} = require("../controllers/users.controllers");

//Create a new user with user's name
router.post("/", createUser);

//Get all users with filters
router.get("/", getUsers);

//	Search for an employee by name
router.get("/:name", getUserByName);

module.exports = router;
