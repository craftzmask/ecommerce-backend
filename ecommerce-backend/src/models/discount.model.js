"use strict";

const { Schema, model } = require("mongoose");
const { DISCOUNT_TYPE, DISCOUNT_APPLIED_TO } = require("../types");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(DISCOUNT_TYPE),
    },
    value: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    usesCount: {
      type: Number,
      default: 0,
    },
    userUsedIds: {
      type: Array,
      default: [],
    },
    maxUsesPerUser: {
      type: Number,
      default: 0,
    },
    minOrderValue: {
      type: Number,
      required: true,
    },
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    appliedTo: {
      type: String,
      enum: Object.values(DISCOUNT_APPLIED_TO),
      default: DISCOUNT_APPLIED_TO.ALL,
    },
    productIds: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, discountSchema);
