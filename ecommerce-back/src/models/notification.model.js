"use strict";

const { Schema, model, Types } = require("mongoose");
const { NOTIFICATION_TYPE } = require("../types");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      default: NOTIFICATION_TYPE.NEW_ORDER,
      enum: Object.values(NOTIFICATION_TYPE),
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

module.exports = model(DOCUMENT_NAME, notificationSchema);
