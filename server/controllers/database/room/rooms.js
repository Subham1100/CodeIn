import Room from "../../../models/room.js";

/**
 * @desc    Get all rooms that the user is a member of
 * @route   GET /api/room/myrooms?userId=123
 * @access  Private
 */
export default async function (req, res) {
  try {
    const rooms = await Room.find(); // You can apply filters here
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error });
  }
}
