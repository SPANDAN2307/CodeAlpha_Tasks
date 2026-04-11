const express = require("express");
const { Order, OrderItem, MenuItem, DiningTable } = require("../models");
const { placeOrder } = require("../services/orderService");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const order = await placeOrder(req.body);
    return res.status(201).json(order);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [
      { model: DiningTable },
      { model: OrderItem, include: [MenuItem] },
    ],
  });

  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }

  return res.json(order);
});

module.exports = router;
