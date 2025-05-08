export default async function handleUserLogout(req, res) {
  // If you're not using sessions or cookies, logout is basically a no-op
  return res
    .status(200)
    .json({ ok: true, message: "User logged out successfully." });
}
