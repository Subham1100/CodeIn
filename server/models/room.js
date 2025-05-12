import mongoose from "mongoose";
import User from "./user.js";

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
          required: true,
        },
        accessTo: {
          whiteboard: {
            type: Boolean,
            default: false,
          },
          codeEditor: {
            type: Boolean,
            default: false,
          },
          giveAccess: {
            type: Boolean,
            default: false,
          },
        },
      },
    ],
  },
  { timestamps: true }
);

// Create and export the Room model
const Room = mongoose.model("room", roomSchema);
export default Room;
