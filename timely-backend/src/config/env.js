const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
  quiet: true,
});

// Keep existing local environments working while standardizing on JWT_SECRET.
if (!process.env.JWT_SECRET && process.env.SECRET) {
  process.env.JWT_SECRET = process.env.SECRET;
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5051,
  dbString: process.env.DBSTRING,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "15m",
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};

const assertServerEnv = () => {
  const missing = [];

  if (!env.dbString) missing.push("DBSTRING");
  if (!env.jwtSecret) missing.push("JWT_SECRET");

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

module.exports = {
  env,
  assertServerEnv,
};
