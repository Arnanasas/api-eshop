const SingleProduct = require("../models/SingleProduct");
const Product = require("../models/Product");

const axios = require("axios");

async function updateSingleProductDetails() {
  try {
    const products = await Product.find({}, "PID"); // Fetch all products with only the PID field

    for (const product of products) {
      const response = await axios.post(
        "https://api.accdistribution.net/v1/GetProduct",
        {
          request: {
            LicenseKey: "ccf5d1eb-f03b-42cc-b943-140a61db9897",
            Locale: "lt",
            Currency: "EUR",
            CompanyId: "_al",
            ProductId: product.PID,
          },
        }
      );
      const productDetails = response.data.Product;

      // Update the product in the database with the new details
      await SingleProduct.findOneAndUpdate(
        { PID: product.PID },
        productDetails,
        {
          new: true,
        }
      );
    }

    console.log("All products have been updated successfully");
  } catch (error) {
    console.error("Error updating product details:", error);
  }
}

module.exports = updateSingleProductDetails;
