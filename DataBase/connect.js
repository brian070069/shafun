const mongoose = require("mongoose");

const connectDataBase = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("connected");
  } catch (error) {
    throw new Error("Failed to connect DataBase");
  }
};

module.exports = { connectDataBase };
