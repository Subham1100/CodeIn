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
router.put(
  "/access",
  passport.authenticate("jwt", { session: false }),
  updateMemberAccess
);
router.delete(
  "/kick",
  passport.authenticate("jwt", { session: false }),
  kickMember
);

export default router;
