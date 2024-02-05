const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  Id: Number,
  CountryId: String,
  SLAId: Number,
  SLA: String,
  Name: String,
  Email: String,
  Address: String,
  City: String,
  Zip: String,
  Country: String,
  Phone: String,
  Url: String,
});

const producerBidSchema = new mongoose.Schema({
  Price: String,
  RemainingQty: String,
  ContractNumber: String,
  BidRequestNumber: String,
  ProducerBidId: String,
  CustomerCode: String,
  CustomerName: String,
  EndUser: String,
  DateFrom: String, // Use String for DateTimeOffset to preserve the exact format
  DateTo: String,
  ProductId: String,
  PID: String,
  MPN: String,
  EAN: String,
  Name: String,
  Picture: String,
});

const producerSchema = new mongoose.Schema({
  OId: String,
  Name: String,
  Price: {
    Value: Number,
    OldValue: Number,
    LatgaValue: Number,
    LatgaOldValue: Number,
    CurrencyCode: String,
    SmartPoints: String,
    SpCampaignId: String,
  },
});

const stockSchema = new mongoose.Schema({
  WhId: String,
  Amount: Number,
  ExpectedDate: String,
  AmountArriving: Number,
  AmountOrdered: String,
  AmountOrderedArrivingDiff: Number,
  IsPreliminary: Boolean,
  Rent: Boolean,
  ByOrder: Boolean,
  Bundle: String,
  EOLSale: Boolean,
  LatgaValue: Number,
  LatgaValueType: Number,
  Warranty: Number,
});

const campaignSchema = new mongoose.Schema({
  OId: String,
  Name: String,
});

const mediaSchema = new mongoose.Schema({
  Type: Number,
  Uri: String,
  OriginalUri: String,
  Order: Number,
  Title: String,
  Description: String,
  LinkText: String,
  EELabel: Boolean,
});

const parameterSchema = new mongoose.Schema({
  OId: Number,
  GroupId: Number,
  ParameterName: String,
  ParameterGroupName: String,
  UseInDescription: Boolean,
  Value: String,
  MeasureId: Number,
  MeasureAbbr: String,
  MeasureFraction: Number,
});

const reserveSchema = new mongoose.Schema({
  OrderQty: Number,
  ReserveQty: Number,
  Price: Number,
});

const attributeSchema = new mongoose.Schema({
  Id: Number,
  Name: String,
  AttributeType: Number,
  IsOptional: Boolean,
  IntraCode: String,
  CountryOfOrigin: String,
  RelatedProducts: String,
});

const priceSchema = new mongoose.Schema({
  Value: Number,
  OldValue: Number,
  LatgaValue: Number,
  LatgaOldValue: Number,
  CurrencyCode: String,
  SmartPoints: { type: Number, default: null }, // Assuming SmartPoints can be a number or null
  SpCampaignId: { type: String, default: null },
  IsSaleout: Boolean,
});

const singleProduct = new mongoose.Schema(
  {
    PID: { type: String, unique: true, required: true },
    CountryId: String,
    ProductId: String,
    Price: priceSchema,
    OldPrice: Number,
    CurrencyCode: String,
    PriceChangeDate: String,
    Services: [serviceSchema],
    ProducerBids: [producerBidSchema],
    Producer: producerSchema,
    Stocks: [stockSchema],
    Campaigns: [campaignSchema],
    Saleouts: [
      {
        OId: String,
      },
    ],
    Branches: [
      {
        OId: Number,
        Name: String,
      },
    ],
    Medias: [mediaSchema],
    Parameters: [parameterSchema],
    CreatedAt: String,
    UpdatedAt: String,
    StocksUpdatedAt: String,
    PricesUpdatedAt: String,
    Reserve: [reserveSchema],
    Attributes: [attributeSchema],
  },
  { timestamps: true }
);

const SingleProduct = mongoose.model("SingleProduct", singleProduct);

module.exports = SingleProduct;
