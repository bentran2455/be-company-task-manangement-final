const mongoose = require("mongoose");
const { Schema } = require("mongoose");
var router = express.Router();

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Task description required"],
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
