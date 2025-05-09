import User from "../../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to your public key file
const privKeyPath = path.resolve(__dirname, "../../../id_rsa_priv.pem");

const PRIVATE_KEY = fs.readFileSync(privKeyPath);

export default async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ ok: false, message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid email or password." });
    }
    const payload = {
      sub: user._id,
      iat: Math.floor(Date.now() / 1000),
    };

    const token = jwt.sign(payload, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "1d",
    });

    // You can optionally set session or cookie here
    return res.status(200).json({
      ok: true,
      message: "Login successful",
      token: "Bearer " + token,
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
