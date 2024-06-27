const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, "username is taken"],
  },
  email: {
    type: String,
    require: true,
    unique: [true, "user with email already exist"],
  },
  password: { type: String, required: true },
  AccountBalance: { type: Number, default: 100000 },
  betList: [String],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
