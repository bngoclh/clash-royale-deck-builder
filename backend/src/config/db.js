const mongoose = require("mongoose");

// const MONGO_URI = "mongodb+srv://hanirekik:TmaspJdWhavjMWRQ@clash-royale-intelligen.zleebm0.mongodb.net/tets";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
