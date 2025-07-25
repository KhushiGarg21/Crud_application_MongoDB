const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  address: String,
  number: Number,
});

module.exports = mongoose.model("User", userSchema);
