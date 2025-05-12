import mongoose from "mongoose";
const whiteboardElementSchema = {
  type: { type: String, required: true },
  offsetX: { type: Number, required: true },
  offsetY: { type: Number, required: true },
  path: {
    type: [[Number]], // Array of [number, number]
    required: true,
  },
  stroke: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
};

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
    whiteboardElements: [whiteboardElementSchema],
    whiteboardHistory: [whiteboardElementSchema],
  },
  { timestamps: true }
);

// Create and export the Room model
const Room = mongoose.model("room", roomSchema);
export default Room;
