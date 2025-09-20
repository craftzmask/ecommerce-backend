"use strict";

const { Schema, model } = require("mongoose");
const slugify = require("slugify");

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
    slug: String,
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
    shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    ratingsAverage: {
      type: String,
      default: 4.5,
      min: [1, "Rating must be at least or above 1.0"],
      max: [5, "Rating must be at most or below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    variations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
  },
  {
    collection: PRODUCT_COLLECTION_NAME,
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

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
    shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
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
    shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
  },
  {
    collection: CLOTHING_COLLECTION_NAME,
    timestamps: true,
  }
);

const productModel = model(PRODUCT_DOCUMENT_NAME, productSchema);
const electronicModel = model(ELECTRONIC_DOCUMENT_NAME, electronicSchema);
const clothingModel = model(CLOTHING_DOCUMENT_NAME, clothingSchema);

module.exports = { productModel, electronicModel, clothingModel };
