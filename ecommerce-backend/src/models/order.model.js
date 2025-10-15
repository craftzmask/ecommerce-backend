"use strict";

const { Types, model, Schema } = require("mongoose");
const { ORDER_STATUS } = require("../types");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    userId: {
      type: Number,
      required: true,
    },
    cartId: {
      type: Types.ObjectId,
      ref: "Cart",
    },
    products: {
      type: Array,
      default: [],
    },
    payment: {
      type: Object,
      required: true,
    },
    shipping: {
      type: Object,
      required: true,
    },
    trackingNumber: {
      type: String,
      default: "0001121212",
      required: true,
    },
    checkoutOrderInfo: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      default: ORDER_STATUS.PENDING,
      enum: Object.values(ORDER_STATUS),
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, orderSchema);
