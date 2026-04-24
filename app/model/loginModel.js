const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const logInSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
});
const loginModel = mongoose.model("login", logInSchema);
module.exports = loginModel;
