const axios = require("axios");

const productService = require("../services/ProductService");

// Test init
exports.getStatus = (req, res) => {
  res.send("Hello world");
};

// Get products
exports.getProducts = async (req, res) => {
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
      response.Products
    );

    // Process and send the response back
    res.json(response.Products.json);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).send("Error fetching products");
  }
};
