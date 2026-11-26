const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CartCraft API is running!");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "success", message: "Server is healthy" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});