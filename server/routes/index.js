const express = require("express");
const router = express.Router();

// Import the Docker routes and Database routes
const dockerRoutes = require("./docker");
const databaseRoutes = require("./database");

// Use the routes, prefixed with `/docker` and `/database`
router.use("/docker", dockerRoutes); // All routes in dockerRoutes will be prefixed with /docker
router.use("/database", databaseRoutes); // All routes in databaseRoutes will be prefixed with /database

module.exports = router;
