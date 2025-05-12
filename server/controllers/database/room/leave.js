import Room from "../../../models/room.js";

/**
 * @desc    Leave a room
 * @route   POST /api/room/leave
 * @access  Private
 */
export default async function (req, res) {
  try {
    const { roomId } = req.body;
    const currUser = req.user._id;

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
      !room.members.some(
        (member) => member.user.toString() === currUser.toString()
      )
    ) {
      return res.status(400).json({ message: "User is not in the room" });
    }

    if (room.host.toString() === currUser.toString()) {
      room.members = room.members.filter(
        (member) => member.user.toString() !== currUser.toString()
      );
      if (room.members.length > 0) {
        // Promote the first remaining member to host
        room.host = room.members[0].user;
        await room.save();
        return res
          .status(200)
          .json({ message: "Host left. New host assigned." });
      } else {
        // No members left, delete the room
        await Room.deleteOne({ roomId });
        return res
          .status(200)
          .json({ message: "Host left. Room deleted as no members remain." });
      }
    } else {
      // Remove user from room members
      room.members = room.members.filter(
        (member) => member.user.toString() !== currUser.toString()
      );
      await room.save();
      return res.status(200).json({ message: "Left room successfully", room });
    }
  } catch (err) {
    console.error("Error leaving room:", err);
    res.status(500).json({ message: "Server error while leaving room" });
  }
}
