const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema({
  name: String,
  ID: Number,
});

const Categories = mongoose.model("Categories", categoriesSchema);

module.exports = Categories;
