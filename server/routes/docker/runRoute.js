const express = require("express");

const router = express.Router();
const { handleRun } = require("../../controllers/docker/run");

router.post("/", handleRun);

module.exports = router;
