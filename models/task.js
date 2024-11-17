const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var assert = require("assert");

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Task name required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Working", "Review", "Done", "Archive"],
    },
    description: {
      type: String,
      required: [true, "Task description required"],
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
