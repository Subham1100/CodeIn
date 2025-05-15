import express from "express";
const app = express();
app.use(express.json());
import { createServer } from "http";

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

import { handleEditor } from "./editor.js";
import { handleSubmit } from "./submit";
import { handleRun } from "./run.js";
app.use("/run", handleRun);
app.use("/submit", handleSubmit);
app.use("/editor/run", handleEditor);

app.get("/", (req, res) => {
  res.send("this is whiteboard");
});
const server = createServer(app);
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
