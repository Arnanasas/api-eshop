const WooCommerceRestApi = require("@woocommerce/woocommerce-rest-api").default;
// import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api"; // Supports ESM

const WooCommerce = new WooCommerceRestApi({
  url: "https://it112.lt", // Your store URL
  consumerKey: "ck_bcee312845382ecbc50916388e5f0669fd0c0e2e", // Your consumer key
  consumerSecret: "cs_edac3331d6b7ff2903ce5595eea844668a9d06d5", // Your consumer secret
  version: "wc/v3", // WooCommerce WP REST API version
});

module.exports = WooCommerce;
