const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "Reservation",
    {
      customerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      customerPhone: {
        type: DataTypes.STRING,
      },
      partySize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reservationTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reservationEndTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      durationMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 90,
      },
      status: {
        type: DataTypes.ENUM("pending", "confirmed", "seated", "cancelled"),
        defaultValue: "confirmed",
      },
    },
    {
      tableName: "reservations",
    }
  );
