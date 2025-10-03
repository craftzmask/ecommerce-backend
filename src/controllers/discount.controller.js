"use strict";

const DiscountService = require("../services/discount.service");
const { OK, CREATED } = require("../core/success.response");

const createDiscountCode = async (req, res) => {
  new CREATED({
    message: "Generate discount code successfully!",
    metadata: await DiscountService.createDiscountCode(req.body),
  }).send(res);
};

const getAllProductsWithDiscountCode = async (req, res) => {
  console.log({ ...req.query });
  new OK({
    message: "Successfully get all products with the discount code",
    metadata: await DiscountService.findAllProductsWithDiscountCode({
      ...req.query,
      shopId: req.params.shopId,
    }),
  }).send(res);
};

const getAllDiscountCodesByShopId = async (req, res) => {
  new OK({
    message: "Successfully get all discount codes from shop",
    metadata: await DiscountService.findAllDiscountCodesByShopId({
      ...req.query,
      shopId: req.params.shopId,
    }),
  }).send(res);
};

const updateDiscountCode = async (req, res) => {
  new OK({
    message: "Updated discount code successfully",
    metadata: await DiscountService.updateDiscountCode({
      id: req.params.id,
      shopId: req.user.userId,
      payload: req.body,
    }),
  }).send(res);
};

const getDiscountAmount = async (req, res) => {
  new OK({
    message: "Get discount amount successfully",
    metadata: await DiscountService.getDiscountAmount(req.body),
  }).send(res);
};

const cancelDiscountCode = async (req, res) => {
  new OK({
    message: "",
    metadata: await DiscountService.cancelDiscountCode({
      id: req.params.id,
      shopId: req.user.userId,
      userId: req.body.userId,
    }),
  }).send(res);
};

const deleteDiscountCode = async (req, res) => {
  new OK({
    message: "",
    metadata: await DiscountService.deleteDiscountCode({
      id: req.params.id,
      shopId: req.user.userId,
    }),
  }).send(res);
};

const DiscountController = {
  createDiscountCode,
  getAllProductsWithDiscountCode,
  getAllDiscountCodesByShopId,
  updateDiscountCode,
  getDiscountAmount,
  cancelDiscountCode,
  deleteDiscountCode,
};

module.exports = DiscountController;
