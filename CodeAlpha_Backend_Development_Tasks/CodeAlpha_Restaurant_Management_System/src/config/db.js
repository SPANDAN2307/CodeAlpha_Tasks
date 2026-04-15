const { Sequelize } = require("sequelize");

const isVercel = process.env.VERCEL === "1";

let sequelize;

if (isVercel && process.env.DATABASE_URL) {
  // ── Vercel: Use PostgreSQL (Neon free tier) ──
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  });
} else {
  // ── Local: Use SQLite ──
  const databasePath = process.env.DATABASE_PATH || "./restaurant.sqlite";
  sequelize = new Sequelize({
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
}

module.exports = sequelize;
