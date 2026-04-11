const express = require("express");
const { Op, fn, col } = require("sequelize");
const { Order, InventoryItem, MenuItem } = require("../models");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

router.get("/daily-sales", adminAuth, async (req, res) => {
  const date = req.query.date || new Date().toISOString().slice(0, 10);
  const start = new Date(`${date}T00:00:00.000Z`);
  const end = new Date(`${date}T23:59:59.999Z`);

  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.between]: [start, end],
      },
      status: {
        [Op.not]: "cancelled",
      },
    },
    attributes: [
      [fn("COUNT", col("id")), "totalOrders"],
      [fn("SUM", col("totalAmount")), "totalSales"],
      [fn("AVG", col("totalAmount")), "averageOrderValue"],
    ],
    raw: true,
  });

  return res.json({ date, metrics: orders[0] });
});

router.get("/stock-alerts", adminAuth, async (req, res) => {
  const threshold = Number(req.query.threshold || 0);
  const allItems = await InventoryItem.findAll({
    include: [MenuItem],
    order: [["quantityInStock", "ASC"]],
  });

  const lowStockItems = allItems.filter(
    (item) => item.quantityInStock <= Math.max(item.reorderLevel, threshold)
  );

  return res.json(lowStockItems);
});

module.exports = router;
