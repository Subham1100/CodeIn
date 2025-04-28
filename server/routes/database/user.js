const express = require("express");
const router = express.Router();

const { handleUserCreation } = require("../../controllers/database/user");

router.post("/api/users", handleUserCreation);

module.exports = router;
