const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Order",
    {
      status: {
        type: DataTypes.ENUM("pending", "preparing", "served", "completed", "cancelled"),
        defaultValue: "pending",
      },
      type: {
        type: DataTypes.ENUM("dine_in", "takeaway"),
        defaultValue: "dine_in",
      },
      customerName: {
        type: DataTypes.STRING,
      },
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
    },
    {
      tableName: "orders",
    }
  );
