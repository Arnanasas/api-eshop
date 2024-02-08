const cron = require("node-cron");
const axios = require("axios");
const SingleProduct = require("../models/SingleProduct");
const Categories = require("../models/Categories");
const mongoose = require("mongoose");

const WooCommerce = require("../scripts/WooCommerce");

// cron.schedule('0 * * * *', function() {
//   console.log('Running a task every hour');
//   fetchAndCreateCategories();
// });


async function fetchAndCreateCategories() {
    try {
        const result = await SingleProduct.aggregate([
            {
              $unwind: "$Branches"
            },
            {
              $group: {
                _id: null,
                categories: { $addToSet: "$Branches" } 
              }
            },
            {
              $project: {
                _id: 0, 
                categories: 1 
              }
            }
          ]);
          const results = result[0].categories;

          results.forEach(async (branch) =>{
            let category = await Categories.findOne({name: branch});

            if(!category) {
              const data = {
                name: branch,
              }

              const response = await WooCommerce.post("products/categories", data);

              console.log(response.data.id);
              
              category = new Categories({
                name: response.data.name, ID: response.data.id
              });

              await category.save();
          } else {
            console.log("Category already exists: ${branch}");
          }
        });
        
          
    } catch(error) {
        console.log(error);
        return 0;
    }
}

module.exports = fetchAndCreateCategories;