
const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Checkout
router.post("/checkout", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const cart = await Cart.findOne({ user: req.user.id })
        .session(session);

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      let totalAmount = 0;
      const orderItems = [];

      for (const item of cart.items) {
        const product = await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity },
          },
          { $inc: { stock: -item.quantity } },
          { new: true, session }
        );

        if (!product) {
          throw new Error("Product unavailable or insufficient stock");
        }

        totalAmount += product.price * item.quantity;

        orderItems.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      const [order] = await Order.create(
        [{
          user: req.user.id,
          items: orderItems,
          totalAmount,
        }],
        { session }
      );

      createdOrder = order;

      cart.items = [];
      await cart.save({ session });
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: createdOrder,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    await session.endSession();
  }
});

// Get my orders
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
