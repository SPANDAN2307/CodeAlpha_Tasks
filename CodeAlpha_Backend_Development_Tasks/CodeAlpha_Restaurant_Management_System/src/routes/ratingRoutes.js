const express = require("express");
const { Rating, MenuItem } = require("../models");

const router = express.Router();

// POST /api/ratings/:menuItemId — submit a rating
router.post("/:menuItemId", async (req, res) => {
  try {
    const { score, customerName, review } = req.body;
    const menuItemId = Number(req.params.menuItemId);

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: "Score must be between 1 and 5." });
    }

    const menuItem = await MenuItem.findByPk(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found." });
    }

    const rating = await Rating.create({
      menuItemId,
      score: Number(score),
      customerName: customerName || "Anonymous",
      review: review || "",
    });

    // Recalculate average rating
    const allRatings = await Rating.findAll({ where: { menuItemId } });
    const total = allRatings.reduce((sum, r) => sum + r.score, 0);
    const avg = total / allRatings.length;

    await menuItem.update({
      rating: Math.round(avg * 10) / 10,
      ratingCount: allRatings.length,
    });

    return res.status(201).json({
      rating,
      updatedAverage: Math.round(avg * 10) / 10,
      totalRatings: allRatings.length,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/ratings/:menuItemId — get all ratings for a dish
router.get("/:menuItemId", async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      where: { menuItemId: Number(req.params.menuItemId) },
      order: [["createdAt", "DESC"]],
    });
    return res.json(ratings);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
