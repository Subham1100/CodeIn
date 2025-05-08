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
router.post("/api/register", handleRegister);
router.post("/api/login", handleLogin);
router.post("/api/logout", handleLogout);

// GET requests
router.get("/api/user/profile", handleUserProfile);

// PUT requests
router.put("/api/user/profile/update", handleProfileUpdate);

// DELETE requests
router.post("/api/delete", handleDelete);

export default router; // Export the router using ESM syntax
