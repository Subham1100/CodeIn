const express = require("express");

const router = express.Router();
const { handleSubmit } = require("../../controllers/docker/submit");

router.post("/", handleSubmit);

module.exports = router;
