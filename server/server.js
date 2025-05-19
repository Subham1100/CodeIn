import express from "express";
import passport from "passport";
const app = express();
app.use(express.json());
import path from "path";
import dotenv from "dotenv";
const envPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../.env"
);

dotenv.config({ path: envPath });

const allowedOrigins = [
  "whiteboard-liart-phi.vercel.app",
  "whiteboard-git-main-subham1100s-projects.vercel.app",
  "whiteboard-lc1uwhja8-subham1100s-projects.vercel.app",
  "whiteboard-subham1100s-projects.vercel.app",
];

//cors
import cors from "cors";
app.use(
  cors({
    origin: "*", // Match your frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Origin: *");
  res.header(
    "Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token"
  );
  next();
});

app.options("/run", cors()); // Handle preflight explicitly

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

import fs from "fs";

const sslOptions = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/whiteboardml.duckdns.org/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/whiteboardml.duckdns.org/fullchain.pem"
  ),
};

const server = createServer(sslOptions, app);

setupSocket(server);

//routes
import routes from "./routes/index.js";

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("this is whiteboard");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
