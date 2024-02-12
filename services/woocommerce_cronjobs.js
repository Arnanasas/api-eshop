const cron = require("node-cron");
const axios = require("axios");
const SingleProduct = require("../models/SingleProduct");
const Categories = require("../models/Categories");
const mongoose = require("mongoose");

const WooCommerce = require("../scripts/WooCommerce");

cron.schedule('* 23 * * *', function() {
  console.log('Running a task every hour');
  updateOrCreateProducts();
});


async function updateOrCreateProducts() {
    try {

    } catch(error) {

    }
}

module.exports = updateOrCreateProducts;