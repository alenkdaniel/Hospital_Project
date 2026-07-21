import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    console.log("Connected Database:", mongoose.connection.name);
    console.log("Mongo URI:", process.env.MONGO_URI);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
