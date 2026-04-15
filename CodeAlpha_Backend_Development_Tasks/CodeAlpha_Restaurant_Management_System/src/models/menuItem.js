const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "MenuItem",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        defaultValue: "Main Course",
      },
      imageUrl: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 4.0,
      },
      ratingCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isVeg: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      preparationTime: {
        type: DataTypes.INTEGER,
        defaultValue: 30,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "menu_items",
    }
  );
