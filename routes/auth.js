var express = require("express");
var router = express.Router();
const { register, logIn, sendInv } = require("../controllers/auth.controllers");

/**
 * @route POST /users/register
 * @description Create a new user/Sign up new account
 * @access public
 * @checkExistence: true
 */
router.post("/register", register);

/**
 * @route POST users/login
 * @description User login
 * @access public
 */
router.post("/login", logIn);

/**
 * @route POST auth/invite/
 * @description User submit sign up request
 * @access public
 */
router.post("/send-invitation", sendInv);

module.exports = router;
