import Room from "../../../models/room.js";

/**
 * @desc    Kick a member from a room
 * @route   DELETE /api/room/members/:userid?roomId=123
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { userid } = req.params;
    const { roomId } = req.body;

    if (!userid || !roomId) {
      return res
        .status(400)
        .json({ message: "userid and roomId are required" });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Remove the member from the room
    room.members = room.members.filter((id) => id.toString() !== userid);

    await room.save();

    return res.status(200).json({ message: "User removed from room" });
  } catch (err) {
    console.error("Error removing user from room:", err);
    res.status(500).json({ message: "Server error while kicking user" });
  }
}
