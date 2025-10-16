"use strict";

const CheckoutService = require("../services/checkout.service");
const { OK } = require("../core/success.response");

const checkoutReview = async (req, res) => {
  OK({
    message: "Checkout review successfully",
    metadata: await CheckoutService.checkoutReview(req.body),
  }).send(res);
};

const CheckoutController = {
  checkoutReview,
};

module.exports = CheckoutController;
