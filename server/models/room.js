import mongoose from "mongoose";

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
          codeEditorOptions: {
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
    roomCode: {
      type: String,
      default: "",
    },
    roomOutput: {
      type: String,
      default: "",
    },
    tlDrawElements: {
      added: [mongoose.Schema.Types.Mixed],
      updated: [mongoose.Schema.Types.Mixed],
      removed: [mongoose.Schema.Types.Mixed],
    },
  },
  { timestamps: true }
);

// Create and export the Room model
const Room = mongoose.model("room", roomSchema);
export default Room;
