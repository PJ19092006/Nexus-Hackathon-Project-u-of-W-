// lib/mongoose.js
import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/hack"; // your local DB

if (!MONGODB_URI) {
  throw new Error("⚠️ Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };

  async function dbConnect() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
      cached.promise = mongoose
        .connect(MONGODB_URI, {
          bufferCommands: false,
        })
        .then((mongoose) => {
          return mongoose;
        });
    }
    try {
      cached.conn = await cached.promise;
      console.log("✅ MongoDB connected successfully");
      return cached.conn;
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      throw err;
    }
  }
}

export default dbConnect;
