"use strict";

const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const CheckoutController = require("../../controllers/checkout.controller");

router.post("/review", asyncErrorHandler(CheckoutController.checkoutReview));

// Require authentication to perform any actions below
router.use(authentication);

module.exports = router;
