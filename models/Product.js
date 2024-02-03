const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  PID: String,
  updatedAt: String,
});

const Products = mongoose.model("Products", productsSchema);

module.exports = Products;
