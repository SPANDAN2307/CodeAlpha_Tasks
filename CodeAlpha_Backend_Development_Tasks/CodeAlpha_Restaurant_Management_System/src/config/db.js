const { Sequelize } = require("sequelize");

const databasePath = process.env.DATABASE_PATH || "./restaurant.sqlite";

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
