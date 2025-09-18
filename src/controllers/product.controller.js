"use strict";

const ProductService = require("../services/product.service");
const { CREATED } = require("../core/success.response");

const createProduct = async (req, res) => {
  new CREATED({
    message: "Create new product successfully!",
    metadata: await ProductService.createProduct({
      ...req.body,
      shop: req.user.userId,
    }),
  }).send(res);
};

const AccessController = { createProduct };

module.exports = AccessController;
