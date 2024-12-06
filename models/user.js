const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    immutable: true,
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
  avatar: {
    type: Buffer,
    default: "https://dummyimage.com/200x200/000/fff",
  },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
