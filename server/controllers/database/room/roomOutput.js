import Room from "../../../models/room.js";

/**
 * @desc    Update a member's room output
 * @route   PUT /api/room/user/:id/access
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { roomId, roomOutput } = req.body;

    if (!roomId || !roomOutput) {
      return res
        .status(400)
        .json({ message: "roomId and roomOutput are required" });
    }

    // Use findOneAndUpdate to directly update the room's roomOutput field
    const updatedRoom = await Room.findOneAndUpdate(
      { roomId },
      { $set: { roomOutput } },
      { new: true } // Ensures the updated document is returned
    );

    // If the room is not found
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res
      .status(200)
      .json({ message: "Room Output updated", room: updatedRoom });
  } catch (err) {
    console.error("Error updating room output:", err);
    res
      .status(500)
      .json({ message: "Server error while updating room output" });
  }
}
