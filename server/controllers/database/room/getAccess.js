import Room from "../../../models/room.js";

/**
 * @desc    Update a member's access in a room (e.g., promote/demote)
 * @route   PUT /api/room/user/:id/access
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { roomId } = req.query;
    const currUser = req.user._id;
    if (!roomId || !currUser) {
      return res
        .status(400)
        .json({ message: "roomId and newAccess are required" });
    }

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    const roomdata = await Room.findOne({ roomId }).populate({
      path: "members.user",
      select: "username",
    });
    // Current user is host: send access for all members
    const data = {};
    roomdata.members.forEach((member) => {
      data[member.user.username] = {
        whiteboard: member.accessTo.whiteboard,
        codeEditor: member.accessTo.codeEditor,
      };
    });
    return res.status(200).json({ accessData: data });
  } catch (err) {
    console.error("Error updating member access:", err);
    res.status(500).json({ message: "Server error while updating access" });
  }
}
