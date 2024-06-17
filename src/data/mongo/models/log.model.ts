import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  message: {
    type: String,
    require: true,
  },
  origin: {
    type: String,
  },
  level: {
    type: String,
    enum: ["low", "medium", "hight"],
    default: "low",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});


export const LogModel = mongoose.model('Log', logSchema)