"use strict";

const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

// Users can search without loggin
router.get(
  "/search/:keySearch",
  asyncErrorHandler(ProductController.searchProductsByUser)
);
router.get("", ProductController.getAllProducts);
router.get("/:id", ProductController.getProduct);

// Require authentication to perform any actions below
router.use(authentication);

router.post("", asyncErrorHandler(ProductController.createProduct));
router.post(
  "/publish/:id",
  asyncErrorHandler(ProductController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncErrorHandler(ProductController.unPublishProductByShop)
);

// QUERY //
router.get(
  "/drafts/all",
  asyncErrorHandler(ProductController.getAllDraftsForShop)
);
router.get(
  "/published/all",
  asyncErrorHandler(ProductController.getAllPublishForShop)
);

module.exports = router;
