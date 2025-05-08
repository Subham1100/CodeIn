import express from "express";
const router = express.Router();

import {
  handleDelete,
  handleLogin,
  handleLogout,
  handleUserProfile,
  handleProfileUpdate,
  handleRegister,
} from "../../controllers/database/user/index.js"; // Make sure to include .js extension if using ESM

// POST requests
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", handleLogout);

// GET requests
router.get("/profile", handleUserProfile);

// PUT requests
router.put("/profile/update", handleProfileUpdate);

// DELETE requests
router.delete("/delete", handleDelete);

export default router; // Export the router using ESM syntax
