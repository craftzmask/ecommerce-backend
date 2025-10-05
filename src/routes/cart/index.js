"use strict";

const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");
const CartController = require("../../controllers/cart.controller");

// Require authentication to perform any actions below
router.use(authentication);

router.get("", asyncErrorHandler(CartController.getAllItemsFromCart));
router.post("", asyncErrorHandler(CartController.addToCart));
router.delete("", asyncErrorHandler(CartController.deleteProductFromCart));
router.post("/update", asyncErrorHandler(CartController.updateCart));

module.exports = router;
