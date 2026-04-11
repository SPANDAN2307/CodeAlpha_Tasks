const express = require("express");
const { DiningTable } = require("../models");
const { isTableAvailable, findAvailableTable } = require("../services/tableService");

const router = express.Router();

router.get("/availability", async (req, res) => {
  const { datetime, partySize, durationMinutes = 90, tableId } = req.query;

  if (!datetime) {
    return res.status(400).json({ message: "datetime query is required." });
  }

  if (tableId) {
    const available = await isTableAvailable(Number(tableId), datetime, Number(durationMinutes));
    return res.json({ tableId: Number(tableId), available });
  }

  if (!partySize) {
    return res.status(400).json({ message: "partySize query is required when tableId is missing." });
  }

  const table = await findAvailableTable(Number(partySize), datetime, Number(durationMinutes));
  return res.json({ available: Boolean(table), table });
});

router.get("/", async (_req, res) => {
  const tables = await DiningTable.findAll({ order: [["tableNumber", "ASC"]] });
  return res.json(tables);
});

module.exports = router;
