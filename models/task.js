const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoose_delete = require("mongoose-delete");
const Counter = require("./counter");

const taskSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
    },
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
    file: {
      type: String,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      "taskCounter",
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.sequence_value;
  }
  next();
});

taskSchema.plugin(mongoose_delete);
const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
