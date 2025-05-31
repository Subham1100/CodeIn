import express from "express";
const router = express.Router();

// Import the Docker routes and Database routes
import dockerRoutes from "./docker/index.js";
import databaseRoutes from "./database/index.js";
import boilerplate from "../controllers/boilerplate.js";

// Use the routes, prefixed with `/docker` and `/database`
router.use("/docker", dockerRoutes); // All routes in dockerRoutes will be prefixed with /docker
router.use("/database", databaseRoutes); // All routes in databaseRoutes will be prefixed with /database
router.get("/get_boilerplate", boilerplate);

export default router;
