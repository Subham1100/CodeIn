import express from "express";
const router = express.Router();
import passport from "passport";
import {
  handleDelete,
  handleLogin,
  handleLogout,
  handleUserProfile,
  handleProfileUpdate,
  handleRegister,
  handleRefresh,
} from "../../controllers/database/user/index.js"; // Make sure to include .js extension if using ESM

// POST requests
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);
router.post("/refresh", handleRefresh);

// GET requests
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  handleUserProfile
);

// PUT requests
router.put(
  "/profile/update",
  passport.authenticate("jwt", { session: false }),
  handleProfileUpdate
);

// DELETE requests
router.delete("/delete", handleDelete);

export default router; // Export the router using ESM syntax
