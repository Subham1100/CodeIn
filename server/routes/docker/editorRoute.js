const express = require("express");
const router = express.Router();
const { handleEditor } = require("../../controllers/docker/editor");

router.post("/", handleEditor);

module.exports = router;
