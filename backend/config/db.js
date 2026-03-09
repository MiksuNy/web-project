const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV === "test"
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI;

    console.log("Connecting to DB:", mongoUri);

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  } catch (error) {
    console.log("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;