import express from "express";
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
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    }, // Match your frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
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
