"use strict";

const { Schema, model } = require("mongoose");
const { CART_STATUS } = require("../types");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    userId: {
      type: Number, // Have not created user model yet
      required: true,
    },
    status: {
      type: String,
      default: CART_STATUS.ACTIVE,
      enum: Object.values(CART_STATUS),
    },
    products: {
      type: Array,
      default: [],
    },
    productCount: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

module.exports = model(DOCUMENT_NAME, cartSchema);
