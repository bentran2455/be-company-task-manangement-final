const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const counterSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    sequence_value: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

const Counter = mongoose.model("Counter", counterSchema);
Counter.findById("taskCounter").then((counter) => {
  if (!counter) {
    new Counter({ _id: "taskCounter", sequence_value: 100 }).save();
  }
});

module.exports = Counter;
