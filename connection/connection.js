require("dotenv").config();
const mongoose = require("mongoose");

const connection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      user: "admin",
      pass: "admin",
      dbName: "tasks",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connection;
