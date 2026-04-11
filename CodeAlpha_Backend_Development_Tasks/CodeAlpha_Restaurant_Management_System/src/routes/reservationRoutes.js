const express = require("express");
const { Reservation, DiningTable } = require("../models");
const { findAvailableTable, isTableAvailable } = require("../services/tableService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      partySize,
      reservationTime,
      durationMinutes = 90,
      tableId,
    } = req.body;

    if (!customerName || !partySize || !reservationTime) {
      return res
        .status(400)
        .json({ message: "customerName, partySize and reservationTime are required." });
    }

    let selectedTable = null;
    const start = new Date(reservationTime);
    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({ message: "reservationTime must be a valid ISO date." });
    }

    if (tableId) {
      selectedTable = await DiningTable.findByPk(tableId);
      if (!selectedTable) {
        return res.status(404).json({ message: "Requested table does not exist." });
      }

      const available = await isTableAvailable(selectedTable.id, start, Number(durationMinutes));
      if (!available) {
        return res.status(409).json({ message: "Requested table is not available for the slot." });
      }
    } else {
      selectedTable = await findAvailableTable(partySize, start, durationMinutes);
    }

    if (!selectedTable) {
      return res.status(409).json({ message: "No available table for the requested slot." });
    }

    const end = new Date(start.getTime() + Number(durationMinutes) * 60 * 1000);

    const reservation = await Reservation.create({
      customerName,
      customerPhone,
      partySize,
      reservationTime: start,
      reservationEndTime: end,
      durationMinutes,
      tableId: selectedTable.id,
      status: "confirmed",
    });

    await selectedTable.update({ status: "reserved" });

    const result = await Reservation.findByPk(reservation.id, { include: [DiningTable] });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/", async (_req, res) => {
  const reservations = await Reservation.findAll({
    include: [DiningTable],
    order: [["reservationTime", "ASC"]],
  });

  return res.json(reservations);
});

module.exports = router;
