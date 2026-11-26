
const express = require("express");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add product
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, price, stock, image } = req.body;

    if (!name || price == null || price < 0) {
      return res.status(400).json({ message: "Valid name and price required" });
    }

    const product = await Product.create({
      name, description, price, stock, image
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

