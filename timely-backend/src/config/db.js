const mongoose = require("mongoose");
const { env } = require("./env");

const connectDB = async () => {
  if (!env.dbString) {
    throw new Error("DBSTRING is not configured");
  }

  const connection = await mongoose.connect(env.dbString);

  console.log(`MongoDB connected: ${connection.connection.host}`);

  return connection;
};

module.exports = connectDB;
