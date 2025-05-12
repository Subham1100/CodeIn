import Room from "../../../models/room.js";
import User from "../../../models/user.js";

/**
 * @desc    Kick a member from a room
 * @route   DELETE /api/room/members/:currUser?roomId=123
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { roomId, username } = req.body;
    const currUser = req.user._id;
    if (!currUser || !roomId || !username) {
      return res
        .status(400)
        .json({ message: "currUser and roomId are required" });
    }
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = targetUser._id;

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.host.toString() !== currUser.toString()) {
      return res.status(403).json({ message: "not authorized" });
    }

    if (
      !room.members.some((member) => {
        return member.user.toString() === userId.toString();
      })
    ) {
      return res.status(404).json({ message: "user not in room" });
    }

    room.members = room.members.filter(
      (member) => member.user.toString() !== userId.toString()
    );
    await room.save();

    return res.status(200).json({ message: "User removed from room" });
  } catch (err) {
    console.error("Error removing user from room:", err);
    res.status(500).json({ message: "Server error while kicking user" });
  }
}
