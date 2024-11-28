const aqp = require("api-query-params");
const User = require("../models/user");
const Invitation = require("../models/invite");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 8;

const signUp = async (req, res) => {
  const user = new User(req.body);
  try {
    const hashPw = await bcrypt.hash(user.password, saltRounds);
    user.password = hashPw;
    const newUser = await user.save();
    res.status(201).json({
      message: "Success",
      user: newUser,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      console.log("error");
      const error = Object.values(err.errors).map((err) => err.message);
      res.status(400).json({
        error: err._message,
        message: error[0],
      });
    } else {
      res.status(400).json({
        message: err.message,
      });
    }
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const doc = await User.findOne({ email });
    if (!doc) throw new Error("The email address has not been registered");
    const pwMatch = await bcrypt.compare(password, doc.password);
    if (!pwMatch) throw new Error("Incorrect password");
    res.status(201).json({
      message: "Success",
      userInfo: doc, // What should I return in userInfo?
      token: jwt.sign(
        {
          email: email,
          password: password,
        },
        "secret"
      ),
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const invite = async (req, res) => {
  const { email } = req.body;
  try {
    const checkSend = await Invitation.findOne({ email });
    const checkUser = await User.findOne({ email });

    if (checkSend) throw new Error("This email has already invited");
    if (checkUser)
      throw new Error("The account has been created for this email");

    const newInvitation = await Invitation.create({
      email: email,
    });
    res.status(200).json({
      message: "Success send invitation",
      data: newInvitation,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

module.exports = { signUp, logIn, invite };
