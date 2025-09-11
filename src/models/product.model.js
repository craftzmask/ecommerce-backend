const { Schema, model } = require("mongoose");

const PRODUCT_DOCUMENT_NAME = "Product";
const PRODUCT_COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    thumb: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    collection: PRODUCT_COLLECTION_NAME,
    timestamps: true,
  }
);

const ELECTRONIC_DOCUMENT_NAME = "Electronic";
const ELECTRONIC_COLLECTION_NAME = "Electronics";

const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      required: true,
    },
    model: String,
    color: String,
  },
  {
    collection: ELECTRONIC_COLLECTION_NAME,
    timestamps: true,
  }
);

const CLOTHING_DOCUMENT_NAME = "Clothing";
const CLOTHING_COLLECTION_NAME = "Clothing";

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: String,
    material: String,
  },
  {
    collection: CLOTHING_COLLECTION_NAME,
    timestamps: true,
  }
);

const Product = model(PRODUCT_DOCUMENT_NAME, productSchema);
const Electronic = model(ELECTRONIC_DOCUMENT_NAME, electronicSchema);
const Clothing = model(CLOTHING_DOCUMENT_NAME, clothingSchema);

module.exports = { Product, Electronic, Clothing };
