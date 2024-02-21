const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,

  emailid: String,

  password: String,

  resetPasswordToken: String,

  resetPasswordTokenExpiery: String,
});

const userModel = mongoose.model("userModel", userSchema);

module.exports = userModel;