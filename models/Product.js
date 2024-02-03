const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  PID: String,
  updatedAt: Date,
});

const Products = mongoose.model("Products", productsSchema);

module.exports = Products;
