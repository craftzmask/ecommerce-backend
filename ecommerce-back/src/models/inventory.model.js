"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock must be at least 0"],
    },
    location: {
      type: String,
      default: "Unknown",
    },
    reservations: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, inventorySchema);
