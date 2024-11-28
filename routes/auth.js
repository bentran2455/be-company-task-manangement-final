var express = require("express");
var router = express.Router();
const { signUp, logIn, invite } = require("../controllers/auth.controllers");

/**
 * @route POST /users/register
 * @description Create a new user/Sign up new account
 * @access public
 * @checkExistence: true
 */
router.post("/register", signUp);

/**
 * @route POST users/login
 * @description User login
 * @access public
 */
router.post("/login", logIn);

/**
 * @route POST users/invite/
 * @description User login
 * @access public
 */
router.post("/invite", invite);

module.exports = router;
