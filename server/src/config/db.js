import mongoose from "mongoose";

export default async function connectDB() {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
