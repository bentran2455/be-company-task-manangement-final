const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var mongoose_delete = require("mongoose-delete");

const taskSchema = new Schema(
  {
    name: {
      type: String,
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "Working", "Review", "Done", "Archive"],
        message:
          "{VALUE} is not a valid status among Pending, Working, Review, Done, Archive",
      },
    },
    description: {
      type: String,
      required: [true, "Task description required"],
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
