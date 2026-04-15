const { Sequelize } = require("sequelize");

const isVercel = process.env.VERCEL === "1";

let sequelize;

if (isVercel) {
  // ── Vercel: ALWAYS use PostgreSQL (Neon) ──
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error(
      "DATABASE_URL is required on Vercel. Set up a free Neon PostgreSQL database at neon.tech and add DATABASE_URL to your Vercel environment variables."
    );
  }
  sequelize = new Sequelize(dbUrl, {
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
