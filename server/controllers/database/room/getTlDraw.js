import Room from "../../../models/room.js";

/**
 * @desc    Update a member's access in a room (e.g., promote/demote)
 * @route   PUT /api/room/user/:id/access
 * @access  Admin / Room Owner
 */
export default async function (req, res) {
  try {
    // console.log("called");
    const { roomId } = req.query;

    if (!roomId) {
      return res
        .status(400)
        .json({ message: "roomId and newAccess are required" });
    }
    // console.log("roomId recived");
    const room = await Room.findOne({ roomId });
    // console.log("room found");
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    // console.log("roomId found");
    return res.status(200).json({
      message: "Room Code updated",
      tlDrawElements: room.tlDrawElements,
    });
  } catch (err) {
    console.error("Error updating member access:", err);
    res.status(500).json({ message: "Server error while updating access" });
  }
}
