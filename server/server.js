const express = require("express");
const app = express();
app.use(express.json());
const mongoose = require("mongoose");

//cors
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5000", // Match your frontend port
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.options("/run", cors()); // Handle preflight explicitly

require("dotenv").config({ path: "../.env" });

//config
require("./config/database");
const morganMiddleware = require("./config/morganlogger");
app.use(morganMiddleware);

//services
const server = require("http").createServer(app);
const setupSocket = require("./services/socketHandler");
setupSocket(server);

//routes
const routes = require("./routes");
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("this is whiteboard");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
