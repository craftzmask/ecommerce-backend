"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    inven_stock: {
      type: Number,
      required: true,
      min: [0, "Stock must be at least 0"],
    },
    inven_location: {
      type: String,
      default: "Unknown",
    },
    inven_reservation: {
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
