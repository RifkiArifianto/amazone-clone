import mongoose from "mongoose";

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Gunakan let daripada var untuk global caching
const globalWithMongoose = global as typeof global & {
  mongoose?: MongooseCache;
};

const cached: MongooseCache = globalWithMongoose.mongoose || {
  conn: null,
  promise: null,
};

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI
): Promise<mongoose.Connection> => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  cached.promise =
    cached.promise || mongoose.connect(MONGODB_URI).then((m) => m.connection);

  cached.conn = await cached.promise;

  // Simpan ke global agar bisa digunakan kembali
  globalWithMongoose.mongoose = cached;

  return cached.conn;
};
