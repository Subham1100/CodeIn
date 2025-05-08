import express from "express";
const router = express.Router();

import userRoutes from "./user.js";
router.use("/api/user", userRoutes);

import roomRoutes from "./room.js";
router.use("/api/room", roomRoutes);

export default router;
