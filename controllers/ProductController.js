const axios = require("axios");

const productService = require("../services/ProductService");
const Product = require("../models/Product");
const SingleProduct = require("../models/SingleProduct");

const WooCommerce = require("../scripts/WooCommerce");

const fetchAndCreateCategories = require("../services/categories_cronjobs");


// Test init
exports.getStatus = async (req, res) => {
  try {
    const results = await fetchAndCreateCategories();
    res.send(results);
  } catch(error) {
    res.status(404);
  }
};

// Get products
exports.getProductsFromAPI = async (req, res) => {
  const offset = req.query.offset;
  const limit = req.query.limit;
  try {
    const response = await axios.post(
      "https://api.accdistribution.net/v1/GetProducts",
      {
        request: {
          LicenseKey: "ccf5d1eb-f03b-42cc-b943-140a61db9897",
          Locale: "lt",
          Currency: "EUR",
          CompanyId: "_al",
          Offset: offset,
          Limit: limit,
          IncludeRRPPrice: true,
          Filters: [{ id: "branch", values: ["1489"] }],
        },
      }
    );

    const updateDatabase = await productService.updateOrCreateProduct(
      response.data.Products
    );

    // Process and send the response back
    res.json(response.data.Products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).send("Error fetching products");
  }
};

// Get all local products

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // Fetch all products from the database
    res.json(products); // Send the products as a response
  } catch (error) {
    console.error("Failed to fetch products from database:", error);
    res.status(500).send("Error fetching products from database");
  }
};

exports.getProduct = async (req, res) => {
  const productID = req.query.productID;
  try {
    const response = await axios.post(
      "https://api.accdistribution.net/v1/GetProduct",
      {
        request: {
          LicenseKey: "ccf5d1eb-f03b-42cc-b943-140a61db9897",
          Locale: "lt",
          Currency: "EUR",
          CompanyId: "_al",
          ProductId: productID,
        },
      }
    );

    // Process and send the response back
    res.json(response.data.Product);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).send("Error fetching products");
  }
};

exports.allImportedProducts = async (req, res) => {
  try {
    const products = await SingleProduct.find({}); // Fetch all products from the database
    res.json(products); // Send the products as a response
  } catch (error) {
    console.error("Failed to fetch products from database:", error);
    res.status(500).send("Error fetching products from database");
  }
};

const fetchDataAndUpdateDatabase = require("../services/cronjobs");

exports.testCron = async (req, res) => {
  try {
    await fetchDataAndUpdateDatabase();
    res.status(200).send("Update successful");
  } catch (error) {
    console.log(error);
    res.status(404).send("Failed to update database");
  }
};
