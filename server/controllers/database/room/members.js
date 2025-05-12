import Room from "../../../models/room.js";

/**
 * @desc    Get all rooms that the user is a member of
 * @route   GET /api/room/myrooms?userId=123
 * @access  Private
 */
export default async function (req, res) {
  try {
    // const { roomId } = req.query;
    const currUser = req.user._id;
    const { roomId } = req.query;

    // console.log("Received roomId:", roomId);
    // console.log("Current User ID:", currUser);
    // Find the room by its ID
    const room = await Room.findOne({ roomId });
    const roomdata = await Room.findOne({ roomId })
      .populate({
        path: "members.user",
        select: "username",
      })
      .populate({
        path: "host",
        select: "username",
      });

    // console.log("Fetched Room:", roomdata);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    let isUserMember = false;
    let currentUsername = "";

    for (const member of roomdata.members) {
      if (member.user._id.toString() === currUser.toString()) {
        isUserMember = true;
        currentUsername = member.user.username; // Save the username
        break;
      }
    }

    if (!isUserMember) {
      return res
        .status(403)
        .json({ message: "User is not a member of this room" });
    }

    const memberDetails = roomdata.members.map(
      (member) => member.user.username
    );

    // const memberDetails = [];
    return res.status(200).json({
      members: memberDetails,
      host: roomdata.host.username,
      currUser: currentUsername,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error });
  }
}
