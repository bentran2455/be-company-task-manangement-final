require("dotenv").config();
const fs = require("fs").promises;
const User = require("../models/user");
const Invitation = require("../models/invite");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 6;
const secretKey = process.env.SECRET_KEY;
const { sendEmail } = require("../services/email.service");

const register = async (req, res) => {
  const user = new User(req.body);
  try {
    if (req.file) {
      // Read the file from the path
      const fileBuffer = await fs.readFile(req.file.path);
      user.avatar = fileBuffer;

      // Optionally, delete the file from the uploads folder after reading
      await fs.unlink(req.file.path);
    }
    const checkUser = await User.findOne({ email: user.email });
    if (checkUser)
      throw new Error("The account has been created for this email");
    const hashPw = bcrypt.hashSync(user.password, saltRounds);
    user.password = hashPw;
    const newUser = await user.save();
    res.status(200).json({
      success: true,
      message: "Successfully registered",
      user: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
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
  let imageUrl;
  const { email, password } = req.body;
  try {
    const doc = await User.findOne({ email });
    if (!doc) throw new Error("The email address has not been registered");
    const pwMatch = await bcrypt.compare(password, doc.password);
    if (!pwMatch) throw new Error("Incorrect password");
    const token = jwt.sign({ _id: doc._id }, secretKey);
    // if (doc.avatar) {
    //   const response = await axios.get(doc.avatar, {
    //     responseType: "arraybuffer",
    //   });
    //   const base64String = Buffer.from(response.data).toString("base64");
    //   imageUrl = `data:image/jpeg;base64,${base64String}`;
    // }
    if (doc.avatar) {
      imageUrl = `data:image/jpeg;base64,${doc.avatar.toString("base64")}`;
    }
    res.status(200).json({
      success: true,
      message: "Successfully logged in",
      userInfo: {
        _id: doc._id,
        name: doc.name,
        role: doc.role,
        avatar: imageUrl,
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

const reqAccess = async (req, res) => {
  const invitation = new Invitation(req.body);
  try {
    const checkSend = await Invitation.findOne({ email: invitation.email });
    const checkUser = await User.findOne({ email: invitation.email });

    if (checkSend) throw new Error("This email is already sent invitation");
    if (checkUser)
      throw new Error("The account has been created for this email");

    const newInvitation = await invitation.save();
    // Send email:
    sendEmail();
    sendEmail(newInvitation.email);
    res.status(201).json({
      message:
        "Request accepted, please check your email for the registration link",
      data: newInvitation,
    });
  } catch (err) {
    res.status(400).json({
      message: `Request failed. ${err}`,
    });
  }
};

module.exports = { register, logIn, reqAccess };
