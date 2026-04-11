const express = require("express");
const { MenuItem, InventoryItem } = require("../models");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/", async (_req, res) => {
  const items = await MenuItem.findAll({ order: [["name", "ASC"]] });
  return res.json(items);
});

// Admin Routes for Menu Management
router.post("/", adminAuth, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const initialStock = req.body.initialStock !== undefined ? req.body.initialStock : 0;
    
    const newItem = await MenuItem.create({ name, description, price, category });
    
    // Automatically create inventory tracing
    await InventoryItem.create({
      menuItemId: newItem.id,
      quantityInStock: initialStock,
      reorderLevel: 10,
      unit: "portion"
    });
    
    return res.status(201).json(newItem);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.update({ name, description, price, category });
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    await item.destroy(); // Auto cascades to delete Inventory record
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
