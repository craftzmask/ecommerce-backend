"use strict";

const ProductService = require("../services/product.service");
const { OK, CREATED } = require("../core/success.response");

const createProduct = async (req, res) => {
  new CREATED({
    message: "Create new product successfully!",
    metadata: await ProductService.createProduct({
      type: req.body.product_type,
      payload: {
        ...req.body,
        product_shop: req.user.userId,
      },
    }),
  }).send(res);
};

// QUERY //
const getAllDraftsForShop = async (req, res) => {
  new OK({
    message: "Fetch all drafts successfully!",
    metadata: await ProductService.findAllDraftsForShop({
      product_shop: req.user.userId,
    }),
  }).send(res);
};
// END QUERY //

const AccessController = { createProduct, getAllDraftsForShop };

module.exports = AccessController;
