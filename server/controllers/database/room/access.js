import Room from "../../../models/room.js";
import User from "../../../models/user.js";

/**
 * @desc    Update a member's access in a room (e.g., promote/demote)
 * @route   PUT /api/room/user/:id/access
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { roomId, newAccess, username } = req.body;
    const currUser = req.user._id;
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const userId = targetUser._id;
    if (!roomId || !newAccess || !currUser) {
      return res
        .status(400)
        .json({ message: "roomId and newAccess are required" });
    }

    const room = await Room.findOne({ roomId });
    // console.log("room found");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Assuming members are stored as objects with access roles
    const member = room.members.find(
      (m) => m.user.toString() === userId.toString()
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found in the room" });
    }
    // console.log(member);
    member.accessTo["whiteboard"] = newAccess.whiteboard;
    member.accessTo["codeEditor"] = newAccess.codeEditor;
    member.accessTo["codeEditorOptions"] = newAccess.codeEditorOptions;
    // console.log(member.accessTo["codeEditor"]);
    await room.save();

    return res.status(200).json({ message: "Member access updated" });
  } catch (err) {
    console.error("Error updating member access:", err);
    res.status(500).json({ message: "Server error while updating access" });
  }
}
