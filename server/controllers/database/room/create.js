import Room from "../../../models/room.js";

/**
 * @desc    Create a new room
 * @route   POST /api/room/create
 * @access  Private (or Public based on your auth)
 */
export default async function (req, res) {
  try {
    const { roomId, currUser } = req.body;

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
    return res.status(201).json(savedRoom);
  } catch (err) {
    console.error("Error creating room:", err);
    res.status(500).json({ message: "Server error while creating room" });
  }
}
