import User from "../../../models/user.js";

export default async function deleteUser(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ ok: false, message: "User ID is required." });
  }

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found." });
    }

    return res
      .status(200)
      .json({ ok: true, message: "User deleted successfully." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error." });
  }
}
