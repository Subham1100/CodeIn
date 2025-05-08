import User from "../../../models/user.js";
import bcrypt from "bcrypt";

export default async function handleUserRegistration(req, res) {
  const hashsalt = 10;
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ ok: false, message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ ok: false, message: "Email already registered." });
    }

    const existingUsername = await User.findOne({ username });

    if (existingUsername) {
      return res
        .status(409)
        .json({ ok: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, hashsalt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      ok: true,
      message: "User registered successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, message: "Internal Server Error" });
  }
}
