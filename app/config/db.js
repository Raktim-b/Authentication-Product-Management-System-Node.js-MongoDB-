const mongoose = require("mongoose");
const Dbcon = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};
module.exports = Dbcon;
