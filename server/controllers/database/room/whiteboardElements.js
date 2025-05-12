import Room from "../../../models/room.js";

/**
 * @desc    Update a member's access in a room (e.g., promote/demote)
 * @route   PUT /api/room/user/:id/access
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { roomId, whiteboardElements } = req.body;

    if (!roomId || !whiteboardElements) {
      return res
        .status(400)
        .json({ message: "roomId and whiteboardElements are required" });
    }

    // Use findOneAndUpdate to directly update the field
    const updatedRoom = await Room.findOneAndUpdate(
      { roomId },
      { $set: { whiteboardElements } },
      { new: true } // Ensures the updated document is returned
    );

    // If the room is not found
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res
      .status(200)
      .json({ message: "Whiteboard elements updated", room: updatedRoom });
  } catch (err) {
    console.error("Error updating member access:", err);
    res.status(500).json({ message: "Server error while updating access" });
  }
}
