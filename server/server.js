import express from "express";
const app = express();
app.use(express.json());

//cors
import cors from "cors";
app.use(
  cors({
    origin: "http://localhost:5000", // Match your frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("/run", cors()); // Handle preflight explicitly

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

//config
import "./config/database.js";
import morganMiddleware from "./config/morganlogger.js";
import configurePassport from "./config/passport.js";
app.use(morganMiddleware);
configurePassport(passport);
app.use(passport.initialize());

//services
import { createServer } from "http";
import setupSocket from "./services/socketHandler.js";
const server = createServer(app);
setupSocket(server);

//routes
import routes from "./routes/index.js";
import passport from "passport";
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("this is whiteboard");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
