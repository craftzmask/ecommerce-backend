"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

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
      enum: ["fixed", "percentage"],
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
      required: true,
    },
    usesCount: {
      type: Number,
      required: true,
    },
    usersUsed: {
      type: Array,
      default: [],
    },
    maxUsesPerUser: {
      type: Number,
      required: true,
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
      required: true,
      enum: ["all", "specific"],
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

class DiscountBuilder {
  constructor() {
    this.name = "";
    this.description = "";
    this.type = "fixed";
    this.value = 0;
    this.code = "";
    this.startDate = new Date();
    this.endDate = new Date();
    this.quantity = 0;
    this.usesCount = 0;
    this.usersUsed = 0;
    this.maxUsesPerUser = 0;
    this.minOrderValue = 0;
    this.shopId = "";
    this.isActive = false;
    this.appliedTo = [];
    this.productIds = [];
  }

  withName(name) {
    this.name = name;
    return this;
  }

  withDescription(description) {
    this.description = description;
    return this;
  }

  withType(type) {
    this.type = type;
    return this;
  }

  withCode(code) {
    this.code = code;
    return this;
  }

  withStartDate(startDate) {
    this.startDate = startDate;
    return this;
  }

  withEndDate(endDate) {
    this.endDate = endDate;
    return this;
  }

  withQuantity(quantity) {
    this.quantity = quantity;
    return this;
  }

  withUsesCount(usesCount) {
    this.usesCount = usesCount;
    return this;
  }

  withMaxUsesPerUser(maxUsesPerUser) {
    this.maxUsesPerUser = maxUsesPerUser;
    return this;
  }

  withMinOrderValue(minOrderValue) {
    this.minOrderValue = minOrderValue;
    return this;
  }

  withShopId(shopId) {
    this.shopId = shopId;
    return this;
  }

  withIsActive(isActive) {
    this.isActive = isActive;
    return this;
  }

  withAppliedTo(appliedTo) {
    this.appliedTo = appliedTo;
    return this;
  }

  withProductIds(productIds) {
    this.productIds = productIds;
    return this;
  }

  build() {}
}

module.exports = model(DOCUMENT_NAME, discountSchema);
