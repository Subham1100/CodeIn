import Room from "../../../models/room.js";
import User from "../../../models/user.js";

/**
 * @desc    Create a new room
 * @route   POST /api/room/create
 * @access  Private (or Public based on your auth)
 */
async function generateUniqueRoomId() {
  let roomId;
  let exists = true;

  while (exists) {
    roomId = Math.floor(1000 + Math.random() * 9000); // Generates 1000–9999
    const room = await Room.findOne({ roomId });
    if (!room) exists = false;
  }

  return roomId;
}
export default async function (req, res) {
  try {
    const currUser = req.user._id;
    const roomId = await generateUniqueRoomId();
    if (!roomId || !currUser) {
      return res.status(400).json({ message: "Name and ownerId are required" });
    }

    const newRoom = new Room({
      roomId: roomId,
      host: currUser,
      members: [
        {
          user: currUser,
          accessTo: {
            whiteboard: true,
            codeEditor: true,
            giveAccess: true,
          },
        },
      ],
    });
    const savedRoom = await newRoom.save();
    return res.status(201).json({ roomId: savedRoom.roomId });
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Server error while creating room" });
  }
}
