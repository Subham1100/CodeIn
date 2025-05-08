// routes/docker/editorRoute.js
import express from "express";
import { handleEditor } from "../../controllers/docker/editor.js";

const router = express.Router();

router.post("/", handleEditor);

export default router;
