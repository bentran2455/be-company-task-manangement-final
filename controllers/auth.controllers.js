require("dotenv").config();
const fs = require("node:fs");
const aqp = require("api-query-params");
const User = require("../models/user");
const Invitation = require("../models/invite");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 6;
const secretKey = process.env.SECRET_KEY;
const { Buffer } = require("node:buffer");

const register = async (req, res) => {
  const user = new User(req.body);
  let avatarString;
  if (user.avatar) {
    const isBuffer = Buffer.isBuffer(user.avatar);
    avatarString = isBuffer
      ? user.avatar.toString("base64")
      : Buffer.from(user.avatar, "binary").toString("base64");
    user.avatar = avatarString;
  }

  try {
    const checkUser = await User.findOne({ email: user.email });
    if (checkUser)
      throw new Error("The account has been created for this email");
    const hashPw = bcrypt.hashSync(user.password, saltRounds);
    user.password = hashPw;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Successfully registered",
      data: avatarString,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
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
    const token = jwt.sign({ _id: doc._id }, secretKey);
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      userInfo: {
        _id: doc._id,
        name: doc.name,
        role: doc.role,
        avatar: doc.avatar,
        tasks: doc.tasks,
      },
      accessToken: token,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

const sendInv = async (req, res) => {
  const invitation = new Invitation(req.body);
  try {
    const checkSend = await Invitation.findOne({ email: invitation.email });
    const checkUser = await User.findOne({ email: invitation.email });

    if (checkSend) throw new Error("This email is already sent invitation");
    if (checkUser)
      throw new Error("The account has been created for this email");

    const newInvitation = await invitation.save();

    res.status(201).json({
      message: "Request accepted",
      data: newInvitation,
      token: jwt.sign(
        {
          email: invitation.email,
        },
        "secret"
      ),
    });
  } catch (err) {
    res.status(400).json({
      message: `Request failed. ${err}`,
    });
  }
};

module.exports = { register, logIn, sendInv };
