const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;

// Start server

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

// Connect to DB

mongoose
  .connect(
    "mongodb+srv://arnas322:rtTh927RDbNH1Bhk@ecom.sft09eh.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// import API's routes

const apiRoutes = require("./routes/api-products");
app.use("/api", apiRoutes);

const SingleProduct = require("./models/SingleProduct"); // Assuming your model is set up
const Product = require("./models/Product");

const axios = require("axios");

async function updateProductDetails() {
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

// const pid = "398819"; // Set the PID of the product you want to update

// async function updateSingleProductDetail(pid) {
//   try {
//     // const response = await axios.get(`https://api.example.com/getProduct/${pid}`);
//     const productDetails =

//     // Update the single product in the SingleProduct model with the new details
//     await SingleProduct.create(productDetails);

//     console.log(`Product details updated for PID: ${pid}`);
//   } catch (error) {
//     console.error(`Error updating product details for PID: ${pid}:`, error);
//   }
// }

// updateSingleProductDetail(pid);

updateProductDetails();
