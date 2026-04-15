const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { MenuItem, InventoryItem, Rating } = require("../models");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Multer config for dish image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, "../../public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `dish-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed."));
  },
});

// GET /api/menu — list all items, optionally filter by category
router.get("/", async (req, res) => {
  try {
    const where = {};
    if (req.query.category) {
      where.category = req.query.category;
    }
    if (req.query.search) {
      const { Op } = require("sequelize");
      where.name = { [Op.like]: `%${req.query.search}%` };
    }

    const items = await MenuItem.findAll({
      where,
      include: [InventoryItem],
      order: [["category", "ASC"], ["name", "ASC"]],
    });
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/menu/categories — list unique categories
router.get("/categories", async (_req, res) => {
  try {
    const items = await MenuItem.findAll({
      attributes: ["category"],
      group: ["category"],
      order: [["category", "ASC"]],
    });
    const categories = items.map((i) => i.category).filter(Boolean);
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// GET /api/menu/:id — single item detail
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id, {
      include: [InventoryItem, Rating],
    });
    if (!item) return res.status(404).json({ message: "Item not found" });
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/menu — admin create with image upload
router.post("/", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, category, isVeg, preparationTime } = req.body;
    const initialStock = req.body.initialStock !== undefined ? Number(req.body.initialStock) : 40;

    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newItem = await MenuItem.create({
      name,
      description,
      price: Number(price),
      category: category || "Main Course",
      isVeg: isVeg === "true" || isVeg === true,
      preparationTime: Number(preparationTime) || 30,
      imageUrl,
    });

    await InventoryItem.create({
      menuItemId: newItem.id,
      quantityInStock: initialStock,
      reorderLevel: 10,
      unit: "portion",
    });

    const result = await MenuItem.findByPk(newItem.id, { include: [InventoryItem] });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// PUT /api/menu/:id — admin update with optional image
router.put("/:id", adminAuth, upload.single("image"), async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.description) updates.description = req.body.description;
    if (req.body.price) updates.price = Number(req.body.price);
    if (req.body.category) updates.category = req.body.category;
    if (req.body.isVeg !== undefined) updates.isVeg = req.body.isVeg === "true" || req.body.isVeg === true;
    if (req.body.preparationTime) updates.preparationTime = Number(req.body.preparationTime);
    if (req.body.isAvailable !== undefined) updates.isAvailable = req.body.isAvailable === "true" || req.body.isAvailable === true;

    if (req.file) {
      // Delete old image if exists
      if (item.imageUrl) {
        const oldImagePath = path.join(__dirname, "../../public", item.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updates.imageUrl = `/uploads/${req.file.filename}`;
    }

    await item.update(updates);
    const result = await MenuItem.findByPk(item.id, { include: [InventoryItem] });
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// DELETE /api/menu/:id — admin delete
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const item = await MenuItem.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Delete associated image
    if (item.imageUrl) {
      const imagePath = path.join(__dirname, "../../public", item.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await item.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
