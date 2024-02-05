const mongoose = require("mongoose");

const othersSchema = new mongoose.Schema({
  Name: String,
  Value: String,
});

const sproductSchema = new mongoose.Schema({
  PID: String,
  Media: [String],
  UpdatedAt: String,
  Price: Double,
  Name: String,
  Quantity: Integer,
  Producer: String,
  Qualities: [othersSchema],
  Branches: [String],
});

const SProduct = mongoose.model("SProduct", sproductSchema);

module.exports = SProduct;
