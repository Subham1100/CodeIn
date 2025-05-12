import express from "express";
import passport from "passport";
const router = express.Router();
import {
  createRoom,
  joinRoom,
  leaveRoom,
  getRooms,
  updateMemberAccess,
  kickMember,
  getRoomMembers,
  getRoomMembersAccess,
  getRoomMembersPermission,
  UpdateRoomCode,
  UpdateRoomOutput,
  UpdateWhiteboardElements,
  GetRoomCode,
  GetRoomOutput,
  GetWhiteboardElements,
  UpdateWhiteboardHistory,
  GetWhiteboardHistory,
} from "../../controllers/database/room/index.js";

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createRoom
);
router.post(
  "/join",
  passport.authenticate("jwt", { session: false }),
  joinRoom
);
router.post(
  "/leave",
  passport.authenticate("jwt", { session: false }),
  leaveRoom
);
router.get("/rooms", getRooms);
router.get(
  "/members",
  passport.authenticate("jwt", { session: false }),
  getRoomMembers
);
router.get(
  "/get-access",
  passport.authenticate("jwt", { session: false }),
  getRoomMembersAccess
);
router.get(
  "/get-permission",
  passport.authenticate("jwt", { session: false }),
  getRoomMembersPermission
);
router.get(
  "/whiteboardHistory",
  passport.authenticate("jwt", { session: false }),
  GetWhiteboardHistory
);

router.get(
  "/roomCode",
  passport.authenticate("jwt", { session: false }),
  GetRoomCode
);
router.get(
  "/roomOutput",
  passport.authenticate("jwt", { session: false }),
  GetRoomOutput
);
router.get(
  "/whiteboardElements",
  passport.authenticate("jwt", { session: false }),
  GetWhiteboardElements
);
router.put(
  "/access",
  passport.authenticate("jwt", { session: false }),
  updateMemberAccess
);
router.put(
  "/roomCode",
  passport.authenticate("jwt", { session: false }),
  UpdateRoomCode
);
router.put(
  "/roomOutput",
  passport.authenticate("jwt", { session: false }),
  UpdateRoomOutput
);
router.put(
  "/whiteboardElements",
  passport.authenticate("jwt", { session: false }),
  UpdateWhiteboardElements
);
router.put(
  "/whiteboardHistory",
  passport.authenticate("jwt", { session: false }),
  UpdateWhiteboardHistory
);

router.delete(
  "/kick",
  passport.authenticate("jwt", { session: false }),
  kickMember
);

export default router;
