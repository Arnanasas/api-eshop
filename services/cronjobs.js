const cron = require("node-cron");
const axios = require("axios");
const Product = require("../models/Product");
const SingleProduct = require("../models/SingleProduct");
const mongoose = require("mongoose");


const logErrorToFile = require("../scripts/logErrorToFile");

cron.schedule('52 * * * *', function() {
  console.log('Running a task every hour');
  fetchDataAndUpdateDatabase();
});

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
          Limit: 21000,
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
          await new Promise((resolve) => setTimeout(resolve, 800));
          updateOrCreateProduct(product.PID);
        }
      } else {
        const newProduct = new Product({
          PID: product.PID,
          UpdatedAt: product.UpdatedAt,
        });
        await newProduct.save();
        await new Promise((resolve) => setTimeout(resolve, 800));
        updateOrCreateProduct(product.PID);
      }
    }
    return 1;
  } catch (error) {
    console.error("Failed to fetch or update products:", error);
    return 0;
  }
}

async function updateOrCreateProduct(PID) {
  let data;
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
    data = response.data.Product; // Assuming the product details are directly under `Product`

    if (!data.Stocks || data.Stocks.length === 0 || data.Stocks[0].Amount === undefined) {
      console.error("Stocks information is missing or incomplete for PID:", PID);
      logErrorToFile(PID, "Stocks information is missing or incomplete", data);
      return; // Skip further processing for this product
    }

    // Transform the data to match the SingleProduct
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
      isOnSale: data.Price.IsSaleout,
      PricesUpdatedAt: data.PricesUpdatedAt,
      StocksUpdatedAt: data.StocksUpdatedAt,
      oldPrice: undefined,
    };


    const newPrice = transformedProductDetails.Price *1.21 *1.05 + 10;
    transformedProductDetails.Price = newPrice;

        // Attempt to find the RRP for CountryId === "lt"
    const rrpForLt = data.RRP.find(item => item.CountryId === "lt");

    if (rrpForLt) {
      // If found, use its Price
      transformedProductDetails.oldPrice = mongoose.Types.Decimal128.fromString(rrpForLt.Price.toString());
    } else {
      // If not found, calculate it using the formula: (Price * 1.21 + 10) * 1.2
      const calculatedPrice = (data.Price.Value * 1.21 + 10) * 1.2;
      transformedProductDetails.oldPrice = mongoose.Types.Decimal128.fromString(calculatedPrice.toString());
    }

    await SingleProduct.findOneAndUpdate(
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
    logErrorToFile(PID, error, data);
  }
}

module.exports = fetchDataAndUpdateDatabase;
