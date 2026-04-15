const { Sequelize } = require("sequelize");
const path = require("path");

// On Vercel, filesystem is read-only except /tmp
const isVercel = process.env.VERCEL === "1";
const databasePath = isVercel
  ? "/tmp/restaurant.sqlite"
  : process.env.DATABASE_PATH || "./restaurant.sqlite";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: databasePath,
  logging: false,
  dialectOptions: {
    timeout: 10000,
  },
  retry: {
    max: 5,
    match: [/SQLITE_BUSY/],
  },
});

module.exports = sequelize;
