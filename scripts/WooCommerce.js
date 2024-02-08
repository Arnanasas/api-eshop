const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;

const dotenv = require("dotenv");
dotenv.config();

const WooCommerce = new WooCommerceRestApi({
  url: process.env.WOO_DOMAIN, // Your store URL
  consumerKey: process.env.WOO_KEY, // Your consumer key
  consumerSecret: process.env.WOO_SEC, // Your consumer secret
  version: "wc/v3", // WooCommerce WP REST API version
});


module.exports = WooCommerce;
