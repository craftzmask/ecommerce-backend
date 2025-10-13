"use strict";

const express = require("express");
const router = express.Router();
const NotificationController = require("../../controllers/notification.controller");
const { authentication } = require("../../auth/authUtils");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

// Require authentication to perform any actions below
router.use(authentication);
router.get(
  "",
  asyncErrorHandler(NotificationController.getListOfNotificationByUserId)
);

module.exports = router;
