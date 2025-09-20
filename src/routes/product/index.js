"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();

const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.post("", asyncErrorHandler(productController.createProduct));
router.get(
  "/drafts/all",
  asyncErrorHandler(productController.getAllDraftsForShop)
);

module.exports = router;
