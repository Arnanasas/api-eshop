const Product = require("../models/Product"); // Assuming your model is set up

exports.updateOrCreateProduct = async (products) => {
  try {
    for (const product of products) {
      const { PID, updatedAt } = product;
      await Product.findOneAndUpdate(
        { PID: PID },
        { $set: { updatedAt: new Date(updatedAt) } },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error("Failed to update or create product:", error);
    throw error;
  }
};
