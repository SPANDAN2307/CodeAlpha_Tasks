const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "DiningTable",
    {
      tableNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("available", "occupied", "reserved"),
        defaultValue: "available",
      },
    },
    {
      tableName: "dining_tables",
    }
  );
