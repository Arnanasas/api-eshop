const cron = require("node-cron");
const axios = require("axios");
const Product = require("../models/Product");
const SProduct = require("../models/SProduct");
const mongoose = require("mongoose");

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
          Limit: 120,
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
          await new Promise((resolve) => setTimeout(resolve, 500));
          updateOrCreateProduct(product.PID);
        }
      } else {
        const newProduct = new Product({
          PID: product.PID,
          UpdatedAt: product.UpdatedAt,
        });
        await newProduct.save();
        await new Promise((resolve) => setTimeout(resolve, 500));
        updateOrCreateProduct(product.PID);
      }
    }
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
    const data = response.data.Product; // Assuming the product details are directly under `Product`

    // Transform the data to match the sproductSchema
    const transformedProductDetails = {
      PID: data.PID,
      Media: data.Medias.map((media) => media.OriginalUri),
      UpdatedAt: data.UpdatedAt,
      Price: mongoose.Types.Decimal128.fromString(data.Price.Value.toString()), // Ensure Price is stored as Decimal128
      Name: data.Name,
      Quantity: data.Stocks[0].Amount,
      Producer: data.Producer.Name,
      Qualities: data.Parameters.map((param) => ({
        Name: param.ParameterName,
        Value: param.Value,
      })),
      Branches: data.Branches?.map((branch) => branch.Name) || [], // Optional chaining in case Branches is not present
    };

    await SProduct.findOneAndUpdate(
      { PID: transformedProductDetails.PID },
      transformedProductDetails,
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    console.log("Product details updated successfully for PID:", PID);
  } catch (error) {
    console.error("Error updating product details for PID:", PID, error);
  }
}

module.exports = fetchDataAndUpdateDatabase;
