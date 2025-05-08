import express from "express";
const router = express.Router();

import userRoutes from "./user.js";
router.use(userRoutes);

import roomRoutes from "./room.js";
router.use("/api/room", roomRoutes);

export default router;
