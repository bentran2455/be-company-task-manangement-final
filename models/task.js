const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoose_delete = require("mongoose-delete");

const taskSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Task name required"],
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Working", "Review", "Done", "Archive"],
        message: "{VALUE} is not a valid status",
      },
    },
    description: {
      type: String,
      required: [true, "Task description required"],
    },
    priority: {
      type: String,
      enum: {
        values: ["Low", "Medium", "High", "Urgent"],
        message: "{VALUE} is not a valid status",
      },
    },
    deadline: {
      type: Date,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.plugin(mongoose_delete);
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
