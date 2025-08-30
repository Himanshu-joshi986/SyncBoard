const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    name: { type: String },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // confirmed friends
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // pending requests
    googleId: { type: String }, // optional if using Google login
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
