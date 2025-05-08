import User from "../../../models/user.js";

export default async function updateUserProfile(req, res) {
  const hashsalt = 10;
  const { userId } = req.params;
  const { firstName, email, password } = req.body;

  if (!userId) {
    return res.status(400).json({ ok: false, message: "User ID is required." });
  }

  try {
    // Find user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found." });
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (email) user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, hashsalt); // hash the new password
    }

    await user.save(); // Save updated user to the database

    return res.status(200).json({
      ok: true,
      message: "User profile updated successfully.",
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, message: "Internal server error." });
  }
}
