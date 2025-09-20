"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const router = express.Router();

const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.post("", asyncErrorHandler(productController.createProduct));

// QUERY //
router.get(
  "/drafts/all",
  asyncErrorHandler(productController.getAllDraftsForShop)
);
router.get(
  "/published/all",
  asyncErrorHandler(productController.getAllPublishForShop)
);

module.exports = router;
