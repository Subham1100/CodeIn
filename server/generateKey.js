import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Your key generation code
const keyPair = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

// Write the keys to files
writeFileSync(__dirname + "/id_rsa_pub.pem", keyPair.publicKey);
writeFileSync(__dirname + "/id_rsa_priv.pem", keyPair.privateKey);

console.log("Keys generated and saved.");
