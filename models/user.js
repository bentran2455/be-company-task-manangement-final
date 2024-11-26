const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var EMAIL_REGEX =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    immutable: true,
    validate: {
      validator: function (value) {
        return EMAIL_REGEX.test(value);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  name: {
    type: String,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z\s]{0,255}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid name!`,
    },
  },
  password: {
    type: String,
    minLength: 8,
    trim: true,
  },
  role: {
    type: String,
    enum: ["Manager", "Employee"],
    default: "Employee",
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});
const User = mongoose.model("User", userSchema);

module.exports = User;
