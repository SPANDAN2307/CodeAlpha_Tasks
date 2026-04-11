require("dotenv").config();

const app = require("./app");
const { sequelize } = require("./models");
const seedData = require("./seed");

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedData();

    app.listen(PORT, () => {
      console.log(`Restaurant backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
