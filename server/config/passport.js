import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";

import User from "../models/user.js";
const envPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../.env"
);

dotenv.config({ path: envPath });
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const privKeyPath = path.resolve(__dirname, "../id_rsa_pub.pem");
// const PUB_KEY = fs.readFileSync(privKeyPath);

const PUB_KEY = process.env.PRIVATE_KEY?.replace(/\\n/g, "\n");

// const PUB_KEY = process.env.PUB_KEY;
// JWT strategy options
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ["RS256"],
};

// Configure passport strategy
const configurePassport = (passport) => {
  passport.use(
    new JwtStrategy(options, async (jwt_payload, done) => {
      try {
        console.log(jwt_payload);

        const user = await User.findOne({ _id: jwt_payload.sub });

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    })
  );
};

export default configurePassport;
