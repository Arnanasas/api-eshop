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

const updateSingleProductDetails = require("./scripts/updateSingleProductDetails");

updateSingleProductDetails()
  .then(() => console.log("Update completed successfully."))
  .catch((error) => console.error("Error during update:", error));
