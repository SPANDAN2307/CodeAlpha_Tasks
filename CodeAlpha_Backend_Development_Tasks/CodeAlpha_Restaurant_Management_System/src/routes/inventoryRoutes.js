const express = require("express");
const { InventoryItem, MenuItem } = require("../models");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", async (_req, res) => {
  const stock = await InventoryItem.findAll({ include: [MenuItem] });
  return res.json(stock);
});

router.patch("/:id", adminAuth, async (req, res) => {
  const stockItem = await InventoryItem.findByPk(req.params.id);
  if (!stockItem) {
    return res.status(404).json({ message: "Inventory item not found." });
  }

  const { quantityInStock, reorderLevel } = req.body;
  await stockItem.update({
    quantityInStock: quantityInStock ?? stockItem.quantityInStock,
    reorderLevel: reorderLevel ?? stockItem.reorderLevel,
  });

  return res.json(stockItem);
});

module.exports = router;
