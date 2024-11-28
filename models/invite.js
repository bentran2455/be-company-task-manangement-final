const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const invitationSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      immutable: true,
    },
    expireAt: {
      type: Date,
      expires: 10,
    },
  },
  {
    timestamps: true,
  }
);

const Invitation = mongoose.model("Invitation", invitationSchema);

module.exports = Invitation;
