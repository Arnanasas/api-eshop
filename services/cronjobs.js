const cron = require("node-cron");
const axios = require("axios");
const Product = require("../models/Product");
const SingleProduct = require("../models/SingleProduct");

// cron.schedule('0 * * * *', function() {
//   console.log('Running a task every hour');
//   fetchDataAndUpdateDatabase();
// });

async function fetchDataAndUpdateDatabase() {
  try {
    const response = await axios.post(
      "https://api.accdistribution.net/v1/GetProducts",
      {
        request: {
          LicenseKey: "ccf5d1eb-f03b-42cc-b943-140a61db9897",
          Locale: "lt",
          Currency: "EUR",
          CompanyId: "_al",
          Offset: 0,
          Limit: 350,
          IncludeRRPPrice: true,
          Filters: [{ id: "branch", values: ["1489"] }],
        },
      }
    );
    const products = response.data.Products; // Adjust according to actual API response structure

    for (const product of products) {
      const existingProduct = await Product.findOne({ PID: product.PID });
      if (existingProduct) {
        if (product.UpdatedAt !== existingProduct.UpdatedAt) {
          await Product.updateOne(
            { PID: product.PID },
            { UpdatedAt: product.UpdatedAt }
          );
          updateOrCreateProduct(product.PID);
        }
      } else {
        const newProduct = new Product({
          PID: product.PID,
          UpdatedAt: product.UpdatedAt,
        });
        await newProduct.save();
        updateOrCreateProduct(product.PID);
      }
    }

    res.status(200);
  } catch (error) {
    console.error("Failed to fetch or update products:", error);
  }
}

async function updateOrCreateProduct(PID) {
  try {
    const response = await axios.post(
      "https://api.accdistribution.net/v1/GetProduct",
      {
        request: {
          LicenseKey: "ccf5d1eb-f03b-42cc-b943-140a61db9897",
          Locale: "lt",
          Currency: "EUR",
          CompanyId: "_al",
          ProductId: PID,
        },
      }
    );
    const productDetails = response.data.Product;

    await SingleProduct.findOneAndUpdate(
      { PID: productDetails.PID },
      productDetails,
      {
        upsert: true,
      }
    );

    console.log("Product details updated successfully for PID:", PID);
  } catch (error) {
    console.error("Error updating product details for PID:", PID, error);
  }
}

module.exports = fetchDataAndUpdateDatabase;
