"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

const commentSchema = new Schema(
  {
    productId: {
      type: Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    parentId: {
      type: Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    left: { type: Number, default: 0 },
    right: { type: Number, default: 0 },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, commentSchema);
