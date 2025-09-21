"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

const asyncErrorHandler = require("../../helpers/asyncErrorHandler");

router.get(
  "/search/:keySearch",
  asyncErrorHandler(productController.searchProductsByUser)
);

router.use(authentication);

router.post("", asyncErrorHandler(productController.createProduct));
router.post(
  "/publish/:id",
  asyncErrorHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncErrorHandler(productController.unPublishProductByShop)
);

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
