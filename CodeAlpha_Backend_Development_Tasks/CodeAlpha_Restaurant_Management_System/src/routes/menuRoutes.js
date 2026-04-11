const express = require("express");
const { MenuItem } = require("../models");

const router = express.Router();

router.get("/", async (_req, res) => {
  const items = await MenuItem.findAll({ order: [["name", "ASC"]] });
  return res.json(items);
});

module.exports = router;
