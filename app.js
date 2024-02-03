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

const SingleProduct = require("ç./models/SingleProduct"); // Assuming your model is set up

async function fetchAndStoreProductData() {
  try {
    const response = await axios.get("https://api.example.com/products"); // Replace with your actual API endpoint
    const productData = response.data; // Assuming the API returns the data directly

    // If the data needs to be transformed to fit your model, do it here

    // await SingleProduct.deleteMany({}); // Optional: Clear the collection before inserting new data
    await SingleProduct.insertMany(productData); // Insert product data into the database
    console.log("SingleProduct data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching or storing product data:", error);
  } finally {
    mongoose.disconnect();
  }
}

fetchAndStoreProductData();
