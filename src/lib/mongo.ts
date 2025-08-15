// src/lib/mongo.ts
import mongoose, { Schema, models, model } from "mongoose";

// <-- энд шууд string болгож өгнө (nullish coalescing + throw)
const uri: string = process.env.MONGODB_URI ?? (() => {
  throw new Error("Missing MONGODB_URI in env");
})();

declare global {
  var _mongoose:
    | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
    | undefined;
  var _mongoEventsBound: boolean | undefined;
}

if (!global._mongoose) global._mongoose = { conn: null, promise: null };

export async function mongoConnect() {
  if (global._mongoose!.conn) return global._mongoose!.conn;
  if (!global._mongoose!.promise) {
    global._mongoose!.promise = mongoose.connect(uri).then(m => m); // uri нь одоо string
  }
  global._mongoose!.conn = await global._mongoose!.promise;

  if (!global._mongoEventsBound) {
    global._mongoEventsBound = true;
    mongoose.connection.on("connected",    () => console.log("MongoDB connected"));
    mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected"));
    mongoose.connection.on("error",        (e) => console.error("MongoDB error:", e));
  }
  return global._mongoose!.conn;
}

/* Жишээ модель */
const EventSchema = new Schema(
  { type: { type: String, required: true, index: true }, payload: Schema.Types.Mixed },
  { timestamps: true }
);
export const EventModel = models.Event ?? model("Event", EventSchema);
