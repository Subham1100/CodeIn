import express from "express";
const router = express.Router();
import {
  createRoom,
  joinRoom,
  leaveRoom,
  getRooms,
  updateMemberAccess,
  kickMember,
} from "../../controllers/database/room/index.js";

router.post("/create", createRoom);
router.post("/join", joinRoom);
router.post("/leave", leaveRoom);
router.get("/rooms", getRooms);
router.put("/user/:id/access", updateMemberAccess);
router.delete("/members/:userid", kickMember);

export default router;
