// routes/docker/dockerRoutes.js
const express = require("express");
const router = express.Router();

const dockerRunRoute = require("./runRoute");
router.use("/run", dockerRunRoute);

const dockerSubmitRoute = require("./submitRoute");
router.use("/submit", dockerSubmitRoute);

const dockerEditorRoute = require("./editorRoute");
router.use("/editor/run", dockerEditorRoute);

module.exports = router;
