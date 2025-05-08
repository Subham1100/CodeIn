// routes/docker/runRoute.js
import express from "express";
import { handleRun } from "../../controllers/docker/run.js";

const router = express.Router();

router.post("/", handleRun);

export default router;
