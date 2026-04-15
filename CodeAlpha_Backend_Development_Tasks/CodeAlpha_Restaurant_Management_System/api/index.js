// Vercel Serverless Entry Point
// Wraps the Express app as a serverless function

require("dotenv").config();

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
    console.log("✅ Database initialized on Vercel");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}

// Export handler
module.exports = async (req, res) => {
  await initialize();
  return app(req, res);
};
