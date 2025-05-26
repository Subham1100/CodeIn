import Room from "../../../models/room.js";

/**
 * @desc    Update a member's access in a room (e.g., promote/demote)
 * @route   PUT /api/room/user/:id/access
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { roomId, tlDrawElements } = req.body;

    if (!roomId || !tlDrawElements) {
      return res
        .status(400)
        .json({ message: "roomId and tlDrawElements are required" });
    }

    // Use findOneAndUpdate to directly update the field
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.tlDrawElements.added.push(...(tlDrawElements.added || []));
    room.tlDrawElements.updated.push(...(tlDrawElements.updated || []));
    room.tlDrawElements.removed.push(...(tlDrawElements.removed || []));

    await room.save();
    return res
      .status(200)
      .json({ message: "Whiteboard elements updated", room: room });
  } catch (err) {
    console.error("Error updating member access:", err);
    res.status(500).json({ message: "Server error while updating access" });
  }
}
