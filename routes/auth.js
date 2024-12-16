const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  register,
  logIn,
  reqAccess,
} = require("../controllers/auth.controllers");

/**
 * @route POST /users/register
 * @description Create a new user/Sign up new account
 * @access public
 * @checkExistence: true
 */
router.post("/register", upload.single("avatar"), register);

/**
 * @route POST users/login
 * @description User login
 * @access public
 */
router.post("/login", logIn);

router.post("/request-access", reqAccess);

module.exports = router;
