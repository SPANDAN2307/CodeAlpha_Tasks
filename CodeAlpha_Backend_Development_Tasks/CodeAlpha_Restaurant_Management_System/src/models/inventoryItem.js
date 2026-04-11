const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "InventoryItem",
    {
      quantityInStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reorderLevel: {
        type: DataTypes.INTEGER,
        defaultValue: 10,
      },
      unit: {
        type: DataTypes.STRING,
        defaultValue: "portion",
      },
    },
    {
      tableName: "inventory_items",
    }
  );
