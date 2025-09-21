"use strict";

const ProductService = require("../services/product.service");
const { OK, CREATED } = require("../core/success.response");
const productRepo = require("../models/repositories/product.repo");

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

const publishProductByShop = async (req, res) => {
  new OK({
    message: "Published product successfully!",
    metadata: await ProductService.publishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id,
    }),
  }).send(res);
};

const unPublishProductByShop = async (req, res) => {
  new OK({
    message: "Unpublished product successfully!",
    metadata: await ProductService.unPublishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id,
    }),
  }).send(res);
};

const searchProductsByUser = async (req, res) => {
  new OK({
    message: "Returned search products",
    metadata: await ProductService.searchProductsByUser({
      keySearch: req.params.keySearch,
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

const getAllPublishForShop = async (req, res) => {
  new OK({
    message: "Fetch all publish successfully!",
    metadata: await ProductService.findAllPublishForShop({
      product_shop: req.user.userId,
    }),
  }).send(res);
};
// END QUERY //

const AccessController = {
  createProduct,
  publishProductByShop,
  unPublishProductByShop,
  getAllDraftsForShop,
  getAllPublishForShop,
  searchProductsByUser,
};

module.exports = AccessController;
