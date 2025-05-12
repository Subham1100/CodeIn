import Room from "../../../models/room.js";

/**
 * @desc    Update whiteboard history in a room
 * @route   PUT /api/room/user/:id/access
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { roomId, whiteboardHistory } = req.body;

    // Validate that both roomId and whiteboardHistory are provided
    if (!roomId || !whiteboardHistory) {
      return res
        .status(400)
        .json({ message: "roomId and whiteboardHistory are required" });
    }

    // Use findOneAndUpdate to directly update the room's whiteboardHistory field
    const updatedRoom = await Room.findOneAndUpdate(
      { roomId },
      { $set: { whiteboardHistory } },
      { new: true } // Ensures the updated document is returned
    );

    // If the room is not found
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res
      .status(200)
      .json({ message: "Whiteboard history updated", room: updatedRoom });
  } catch (err) {
    console.error("Error updating whiteboard history:", err);
    res
      .status(500)
      .json({ message: "Server error while updating whiteboard history" });
  }
}
