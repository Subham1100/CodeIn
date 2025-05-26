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
    // Current user is host: send access for all members
    let data = {};
    room.members.forEach((member) => {
      if (currUser.toString() === member.user.toString()) {
        data = {
          whiteboard: member.accessTo.whiteboard,
          codeEditor: member.accessTo.codeEditor,
          codeEditorOptions: member.accessTo.codeEditorOptions,
        };
      }
    });

    return res.status(200).json({ permissions: data });
  } catch (err) {
    console.error("Error updating member access:", err);
    res.status(500).json({ message: "Server error while updating access" });
  }
}
