const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/codemath";
    
    if (!mongoURI) {
      console.log("⚠️  MongoDB URI not found, but continuing without database...");
      return;
    }

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected: " + conn.connection.host);
  } catch (error) {
    console.log("⚠️  MongoDB connection failed, but continuing without database...");
    console.log("💡 To fix this, set MONGODB_URI in your .env file");
  }
};

module.exports = connectDB;
