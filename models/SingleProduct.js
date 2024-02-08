const mongoose = require("mongoose");

const othersSchema = new mongoose.Schema({
  Name: String,
  Value: String,
});

const singleProductSchema = new mongoose.Schema({
  PID: String,
  Media: [String],
  UpdatedAt: String,
  Price: Number,
  Name: String,
  Quantity: Number,
  Producer: String,
  Qualities: [othersSchema],
  Branches: [String],
  isOnSale: Boolean,
  oldPrice: Number,
  PricesUpdatedAt: String,
  StocksUpdatedAt: String,
});

const SingleProduct = mongoose.model("SingleProduct", singleProductSchema);

module.exports = SingleProduct;
