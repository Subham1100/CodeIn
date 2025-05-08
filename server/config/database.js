import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
const envPath = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "../../.env"
);

dotenv.config({ path: envPath });
/**
 * -------------- DATABASE ----------------
 */

/**
 * Connect to MongoDB Server using the connection string in the `.env` file.
 * To implement this, place the following string into the `.env` file:
 *
 * DB_STRING=mongodb://<user>:<password>@localhost:27017/database_name
 * DB_STRING_PROD=<your production database string>
 */

const devConnection = process.env.DB_STRING;
const prodConnection = process.env.DB_STRING_PROD;

// Connect to the correct environment database
if (process.env.NODE_ENV === "production") {
  mongoose
    .connect(prodConnection, {})
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
} else {
  mongoose
    .connect(devConnection, {})
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.error("Database connection error:", err);
    });
}
