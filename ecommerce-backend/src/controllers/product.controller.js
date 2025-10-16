"use strict";

const ProductService = require("../services/product.service");
const { OK, CREATED } = require("../core/success.response");

const createProduct = async (req, res) => {
  CREATED({
    message: "Create new product successfully!",
    metadata: await ProductService.createProduct({
      type: req.body.type,
      payload: {
        ...req.body,
        shopId: req.user.userId,
      },
    }),
  }).send(res);
};

const publishProductByShop = async (req, res) => {
  OK({
    message: "Published product successfully!",
    metadata: await ProductService.publishProductByShop({
      shopId: req.user.userId,
      productId: req.params.id,
    }),
  }).send(res);
};

const unPublishProductByShop = async (req, res) => {
  OK({
    message: "Unpublished product successfully!",
    metadata: await ProductService.unPublishProductByShop({
      shopId: req.user.userId,
      productId: req.params.id,
    }),
  }).send(res);
};

const searchProductsByUser = async (req, res) => {
  OK({
    message: "Returned search products",
    metadata: await ProductService.searchProductsByUser({
      keySearch: req.params.keySearch,
    }),
  }).send(res);
};

const updateProduct = async (req, res) => {
  OK({
    message: "Update product successfully!",
    metadata: await ProductService.updateProduct({
      productId: req.params.productId,
      shopId: req.user.userId,
      type: req.body.type,
      payload: req.body,
    }),
  }).send(res);
};

// QUERY //
const getAllDraftsForShop = async (req, res) => {
  OK({
    message: "Fetch all drafts successfully!",
    metadata: await ProductService.findAllDraftsForShop({
      shopId: req.user.userId,
    }),
  }).send(res);
};

const getAllPublishForShop = async (req, res) => {
  OK({
    message: "Fetch all publish successfully!",
    metadata: await ProductService.findAllPublishForShop({
      shopId: req.user.userId,
    }),
  }).send(res);
};

const getAllProducts = async (req, res) => {
  OK({
    message: "Get all products successfully!",
    metadata: await ProductService.findAllProducts(req.query),
  }).send(res);
};

const getProduct = async (req, res) => {
  OK({
    message: "Get product successfully!",
    metadata: await ProductService.findProduct({
      product_id: req.params.id,
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
  getAllProducts,
  getProduct,
  searchProductsByUser,
  updateProduct,
};

module.exports = AccessController;
