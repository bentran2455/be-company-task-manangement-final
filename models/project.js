const mongoose = require("mongoose");
const { Schema } = require("mongoose");
var mongoose_delete = require("mongoose-delete");

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
    },
    description: {
      type: String,
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

projectSchema.plugin(mongoose_delete);
const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
