import Room from "../../../models/room.js";

/**
 * @desc    Join an existing room
 * @route   POST /api/room/join
 * @access  Private (or Public depending on setup)
 */
export default async function (req, res) {
  try {
    const { roomId, userId } = req.body;

    if (!roomId || !userId) {
      return res
        .status(400)
        .json({ message: "roomId and userId are required" });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.members.includes(currUser)) {
      return res.status(200).json({ message: "User already in the room" });
    } else {
      room.members.push(currUser);
      await room.save();
      return res
        .status(200)
        .json({ message: "Joined room successfully", room });
    }
  } catch (err) {
    console.error("Error joining room:", err);
    res.status(500).json({ message: "Server error while joining room" });
  }
}
