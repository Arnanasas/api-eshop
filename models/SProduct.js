const mongoose = require("mongoose");

const othersSchema = new mongoose.Schema({
  Name: String,
  Value: String,
});

const sproductSchema = new mongoose.Schema({
  PID: String,
  Media: [String],
  UpdatedAt: String,
  Price: Number,
  Name: String,
  Quantity: Number,
  Producer: String,
  Qualities: [othersSchema],
  Branches: [String],
});

const SProduct = mongoose.model("SProduct", sproductSchema);

module.exports = SProduct;
