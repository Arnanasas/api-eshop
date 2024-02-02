const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/status", (request, response) => {
  const status = {
    Status: "Running",
  };

  response.send(status);
});

app.get("/api/products", async (req, res) => {
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

    // Process and send the response back
    res.json(response.data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).send("Error fetching products");
  }
});
