import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");
const PUBLIC_KEY = process.env.PUB_KEY?.replace(/\\n/g, "\n");

export default async function handleRefresh(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    console.log("not");
    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {
    const payload = jwt.verify(refreshToken, PUBLIC_KEY, {
      algorithms: ["RS256"],
    });

    const newAccessToken = jwt.sign({ sub: payload.sub }, PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "4h",
    });

    res.json({ accessToken: "Bearer " + newAccessToken });
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }
}
