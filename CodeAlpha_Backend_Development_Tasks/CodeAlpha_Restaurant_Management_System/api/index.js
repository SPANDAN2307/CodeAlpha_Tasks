// Vercel Serverless Entry Point
// Wraps the Express app as a serverless function

try {
  require("dotenv").config();
} catch (e) {
  // dotenv may not be needed on Vercel (env vars set via dashboard)
}

const app = require("../src/app");
const { sequelize } = require("../src/models");
const seedData = require("../src/seed");

let isInitialized = false;

async function initialize() {
  if (isInitialized) return;
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedData();
    isInitialized = true;
    console.log("✅ Database initialized");
  } catch (error) {
    console.error("❌ Database init failed:", error.message);
    // Don't throw - let the app still respond with error messages
    isInitialized = true;
  }
}

// Export handler for Vercel
module.exports = async (req, res) => {
  await initialize();
  return app(req, res);
};
