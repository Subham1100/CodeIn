import Room from "../../../models/room.js";

/**
 * @desc    Update a member's access in a room (e.g., promote/demote)
 * @route   PUT /api/room/user/:id/access
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { roomId, newAccess, currUser } = req.body;

    if (!roomId || !newAccess || !currUser) {
      return res
        .status(400)
        .json({ message: "roomId and newAccess are required" });
    }

    const room = await Room.findOne({ roomId });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Assuming members are stored as objects with access roles
    const member = room.members.find(
      (m) => m.user.toString() === currUser.toString()
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found in the room" });
    }
    const validAccess = ["whiteboard", "codeEditor", "giveAccess"];
    if (!validAccess.includes(newAccess)) {
      return res.status(400).json({ message: "Invalid access type" });
    }

    member.accessTo[newAccess] = !member.accessTo[newAccess];

    await room.save();

    return res.status(200).json({ message: "Member access updated" });
  } catch (err) {
    console.error("Error updating member access:", err);
    res.status(500).json({ message: "Server error while updating access" });
  }
}
