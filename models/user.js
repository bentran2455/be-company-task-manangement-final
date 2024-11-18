const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      // required: [true, "Employee name is required"],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z\s]{0,255}$/.test(value);
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
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
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
