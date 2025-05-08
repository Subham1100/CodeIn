// routes/docker/submitRoute.js
import express from "express";
import { handleSubmit } from "../../controllers/docker/submit.js";

const router = express.Router();

router.post("/", handleSubmit);

export default router;
