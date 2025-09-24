"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      enum: ["fix_amount", "percentage"],
    },
    discount_value: {
      type: Number,
      required: true,
    },
    discount_code: {
      type: String,
      required: true,
    },
    discount_startDate: {
      type: Date,
      required: true,
    },
    discount_endDate: {
      type: Date,
      required: true,
    },
    discount_quantity: {
      type: Number,
      rqeuired: true,
    },
    discount_usesCount: {
      type: Number,
      required: true,
    },
    discount_usersUsed: {
      type: Array,
      default: [],
    },
    discount_maxUsesPerUser: {
      type: Number,
      required: true,
    },
    discount_minOrderValue: {
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_isActive: {
      type: Boolean,
      default: true,
    },
    discount_appliedTo: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_productIds: {
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
