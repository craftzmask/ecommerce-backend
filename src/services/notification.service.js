"use strict";

const { NOTIFICATION_TYPE } = require("../types");
const NotificationModel = require("../models/notification.model");

const pushToSystem = async ({ type, senderId, receiverId, options = {} }) => {
  // @@@ and @@@@ are placeholders
  // @@@ is the name of the shop
  // @@@@ is the name of the product
  let content = "";
  if (type === NOTIFICATION_TYPE.NEW_ORDER) {
    content = "@@@: add a new product: @@@@";
  } else if (type === NOTIFICATION_TYPE.DISCOUNT_ORDER) {
    content = "@@@@ has a new discount";
  } else if (type === NOTIFICATION_TYPE.NEW_PROMO) {
    content = "@@@: has a new promo. Please check it out";
  }

  return await NotificationModel.create({
    type,
    senderId,
    receiverId,
    content,
    options,
  });
};

const NotificationService = { pushToSystem };

module.exports = NotificationService;
