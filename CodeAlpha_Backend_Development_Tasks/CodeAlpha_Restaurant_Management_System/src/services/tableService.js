const { Op } = require("sequelize");
const { DiningTable, Reservation } = require("../models");

function getWindowBounds(startDate, durationMinutes) {
  const start = new Date(startDate);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return { start, end };
}

async function isTableAvailable(tableId, reservationTime, durationMinutes = 90) {
  const { start, end } = getWindowBounds(reservationTime, durationMinutes);

  const existingReservation = await Reservation.findOne({
    where: {
      tableId,
      status: {
        [Op.notIn]: ["cancelled"],
      },
      reservationTime: { [Op.lt]: end },
      reservationEndTime: { [Op.gt]: start },
    },
  });

  return !existingReservation;
}

async function findAvailableTable(partySize, reservationTime, durationMinutes = 90) {
  const tables = await DiningTable.findAll({
    where: {
      capacity: { [Op.gte]: partySize },
    },
    order: [["capacity", "ASC"]],
  });

  for (const table of tables) {
    const available = await isTableAvailable(table.id, reservationTime, durationMinutes);
    if (available) {
      return table;
    }
  }

  return null;
}

module.exports = {
  isTableAvailable,
  findAvailableTable,
};
