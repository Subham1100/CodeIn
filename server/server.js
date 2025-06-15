import express from "express";
import passport from "passport";
const app = express();
app.use(express.json());
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
const envPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../.env"
);

dotenv.config({ path: envPath });
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

//cors

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, OPTIONS"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//   }

//   next();
// });

import cookieParser from "cookie-parser";
app.use(cookieParser());

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

// const sslOptions = {
//   key: fs.readFileSync(
//     "/etc/letsencrypt/live/whiteboardml.duckdns.org/privkey.pem"
//   ),
//   cert: fs.readFileSync(
//     "/etc/letsencrypt/live/whiteboardml.duckdns.org/fullchain.pem"
//   ),
// };

// const server = createServer(sslOptions, app);
const server = createServer(app);

setupSocket(server);

//routes
import routes from "./routes/index.js";

app.use("/", routes);

app.get("/", (req, res) => {
  res.send("this is whiteboard");
});

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => {
  console.log(`server is running on http://localhost:${port}`);
});
