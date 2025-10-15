"use strict";

const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const DiscountController = require("../../controllers/discount.controller");

router.get(
  "/shops/:shopId/products",
  asyncErrorHandler(DiscountController.getAllProductsWithDiscountCode)
);
router.get(
  "/shop/:shopId",
  asyncErrorHandler(DiscountController.getAllDiscountCodesByShopId)
);
router.get("/amount", asyncErrorHandler(DiscountController.getDiscountAmount));

// Require authentication to perform any actions below
router.use(authentication);

router.post("", asyncErrorHandler(DiscountController.createDiscountCode));
router.post(
  "/cancel/:id",
  asyncErrorHandler(DiscountController.cancelDiscountCode)
);
router.delete("/:id", asyncErrorHandler(DiscountController.deleteDiscountCode));
router.patch("/:id", asyncErrorHandler(DiscountController.updateDiscountCode));

module.exports = router;
