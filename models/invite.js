const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const invitationSchema = new Schema(
  {
    fullName: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      immutable: true,
    },
    expireAt: {
      type: Date,
      expires: 3600,
    },
  },
  {
    timestamps: true,
  }
);

const Invitation = mongoose.model("Invitation", invitationSchema);

module.exports = Invitation;
