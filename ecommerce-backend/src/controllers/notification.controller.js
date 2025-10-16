"use strict";

const NotificationService = require("../services/notification.service");
const { OK } = require("../core/success.response");

const getListOfNotificationByUserId = async (req, res) => {
  OK({
    message: "Get list of notification successfully",
    metadata: await NotificationService.getListOfNotificationByUserId(req.body),
  }).send(res);
};

const CommentController = { getListOfNotificationByUserId };

module.exports = CommentController;
