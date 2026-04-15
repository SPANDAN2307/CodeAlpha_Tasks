// Vercel Serverless Entry Point
// Uses lazy initialization with diagnostic error reporting

let app, sequelize, seedData;
let initError = null;
let isInitialized = false;

// Try loading modules (catches native module failures)
try {
  require("dotenv").config();
} catch (_) {}

try {
  app = require("../src/app");
  const models = require("../src/models");
  sequelize = models.sequelize;
  seedData = require("../src/seed");
} catch (error) {
  initError = error;
  console.error("❌ Module load failed:", error.message);
}

async function initialize() {
  if (isInitialized) return;
  if (initError) return; // Don't try DB if modules failed
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedData();
    isInitialized = true;
    console.log("✅ Database initialized");
  } catch (error) {
    console.error("❌ DB init failed:", error.message);
    initError = error;
  }
}

module.exports = async (req, res) => {
  // If modules failed to load, return diagnostic error
  if (initError && !app) {
    return res.status(500).json({
      error: "Server initialization failed",
      message: initError.message,
      hint: "Check Vercel function logs for details",
    });
  }

  try {
    await initialize();
  } catch (_) {}

  // If DB failed but Express loaded, still try to serve static files
  return app(req, res);
};
