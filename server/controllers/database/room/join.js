import Room from "../../../models/room.js";

/**
 * @desc    Join an existing room
 * @route   POST /api/room/join
 * @access  Private (or Public depending on setup)
 */
export default async function (req, res) {
  try {
    const { roomId, currUser } = req.body;

    if (!roomId || !currUser) {
      return res
        .status(400)
        .json({ message: "roomId and currUser are required" });
    }

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (
      room.members.some(
        (member) => member.user.toString() === currUser.toString()
      )
    ) {
      return res.status(200).json({ message: "User already in the room" });
    } else {
      room.members.push({
        user: currUser,
        accessTo: { whiteboard: false, codeEditor: false, giveAccess: false },
      });
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
