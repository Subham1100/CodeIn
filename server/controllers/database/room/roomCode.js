import Room from "../../../models/room.js";

/**
 * @desc    Update a member's room code
 * @route   PUT /api/room/user/:id/access
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    const { roomId, roomCode } = req.body;

    if (!roomId || !roomCode) {
      return res
        .status(400)
        .json({ message: "roomId and roomCode are required" });
    }

    // Use findOneAndUpdate to directly update the room's roomCode field
    const updatedRoom = await Room.findOneAndUpdate(
      { roomId },
      { $set: { roomCode } },
      { new: true } // Ensures the updated document is returned
    );

    // If the room is not found
    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    return res
      .status(200)
      .json({ message: "Room Code updated", room: updatedRoom });
  } catch (err) {
    console.error("Error updating member access:", err);
    res.status(500).json({ message: "Server error while updating access" });
  }
}
