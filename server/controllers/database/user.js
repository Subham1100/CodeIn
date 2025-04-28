const User = require("../../models/user");

async function handleUserCreation(req, res) {
  const body = req.body;
  if (!body || !body.firstName) {
    return res
      .status(400)
      .json({ ok: false, message: "all fields are required" });
  }
  const result = await User.create({
    firstName: body.firstName,
  });
  console.log(result);
  return res.status(200).json({ message: "success" });
}
module.exports = { handleUserCreation };
