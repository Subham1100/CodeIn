import User from "../../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const envPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../.env"
);

dotenv.config({ path: envPath });
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const privKeyPath = path.resolve(__dirname, "../../../id_rsa_priv.pem");
// const PRIVATE_KEY = fs.readFileSync(privKeyPath);
// const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");
export default async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const COOKIE_SECURE = process.env.COOKIE_SECURE === "true";

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
      expiresIn: "4h",
    });
    const refreshToken = jwt.sign({ sub: user._id }, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    // You can optionally set session or cookie here
    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: COOKIE_SECURE, // only HTTPS in prod
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        ok: true,
        message: "Login successful",
        token: "Bearer " + token,
        refreshToken: refreshToken,

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
