// routes/docker/dockerRoutes.js
import express from "express";
import dockerRunRoute from "./runRoute.js";
import dockerSubmitRoute from "./submitRoute.js";
import dockerEditorRoute from "./editorRoute.js";

const router = express.Router();

router.use("/run", dockerRunRoute);
router.use("/submit", dockerSubmitRoute);
router.use("/editor/run", dockerEditorRoute);

export default router;
