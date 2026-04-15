// Vercel Serverless Entry Point
// Uses PostgreSQL (Neon) instead of SQLite on Vercel

try {
  require("dotenv").config();
} catch (_) {}

let app, sequelize, seedData;
let initError = null;
let isInitialized = false;

try {
  app = require("../src/app");
  const models = require("../src/models");
  sequelize = models.sequelize;
  seedData = require("../src/seed");
} catch (error) {
  initError = error;
  console.error("❌ Module load failed:", error.message, error.stack);
}

async function initialize() {
  if (isInitialized) return;
  if (initError) return;
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");
    await sequelize.sync();
    console.log("✅ Tables synced");
    await seedData();
    console.log("✅ Seed complete");
    isInitialized = true;
  } catch (error) {
    console.error("❌ DB init failed:", error.message, error.stack);
    initError = error;
  }
}

module.exports = async (req, res) => {
  if (initError && !app) {
    return res.status(500).json({
      error: "Server initialization failed",
      message: initError.message,
    });
  }

  await initialize();
  return app(req, res);
};
