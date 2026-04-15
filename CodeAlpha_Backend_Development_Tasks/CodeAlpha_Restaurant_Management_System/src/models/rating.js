const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Rating",
    {
      menuItemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      customerName: {
        type: DataTypes.STRING,
        defaultValue: "Anonymous",
      },
      review: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
    },
    {
      tableName: "ratings",
    }
  );
