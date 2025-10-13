"use strict";

const { Schema, model, Types } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

const commentSchema = new Schema(
  {
    type: {
      type: String,
      enum: [],
    },
    senderId: {
      type: Types.ObjectId,
      ref: "Shop",
    },
    receiverId: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      minLength: 5,
      required: true,
    },
    options: {
      type: Object,
      default: {},
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = model(DOCUMENT_NAME, commentSchema);
