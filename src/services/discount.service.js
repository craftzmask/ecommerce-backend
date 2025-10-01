"use strict";

const {
  ConflictRequestError,
  BadRequestError,
  NotFoundError,
} = require("../core/error.response");
const DiscountModel = require("../models/discount.model");
const DiscountRepo = require("../models/repositories/discount.repo");
const ProductRepo = require("../models/repositories/product.repo");

const createDiscountCode = async ({
  name,
  description,
  type,
  value,
  code,
  startDate,
  endDate,
  quantity,
  usesCount,
  usersUsed,
  maxUsesPerUser,
  minOrderValue,
  shopId,
  isActive,
  appliedTo,
  productIds,
}) => {
  const now = new Date();
  if (now < new Date(startDate) || now > new Date(endDate)) {
    throw new BadRequestError("Discount code is expired");
  }

  if (new Date(startDate) >= new Date(endDate)) {
    throw new BadRequestError("Start date must be before end date");
  }

  const foundDiscount = await DiscountModel.findOne({ code, shopId }).lean();

  if (foundDiscount && foundDiscount.discount_isActive) {
    throw new ConflictRequestError("Discount code already exists");
  }

  const newDiscountCode = await DiscountModel.create({
    name,
    description,
    type,
    value,
    code,
    shopId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    quantity,
    usesCount,
    usersUsed,
    maxUsesPerUser,
    minOrderValue,
    isActive,
    appliedTo,
    productIds,
  });

  return newDiscountCode;
};

const findAllProductsWithDiscountCode = async ({
  code,
  shopId,
  limit,
  page,
}) => {
  const foundDiscount = await DiscountModel.findOne({ code, shopId });
  if (!foundDiscount || !foundDiscount.isActive) {
    throw new NotFoundError("Discount does not exist");
  }

  if (foundDiscount.appliedTo === "all") {
    return ProductRepo.findAllProducts({
      filter: {
        product_shop: shopId,
        isPublished: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      select: ["product_name"],
    });
  }

  if (foundDiscount.appliedTo === "specific") {
    return ProductRepo.findAllProducts({
      filter: {
        _id: { $in: foundDiscount.productIds },
        isPublished: true,
      },
      limit: +limit,
      page: +page,
      sort: "ctime",
      select: ["product_name"],
    });
  }

  return [];
};

const findAllDiscountCodesByShopId = async ({ limit, page, shopId }) => {
  return await DiscountRepo.findAllDiscountCodesUnSelect({
    limit: +limit,
    page: +page,
    model: DiscountModel,
    filter: { shopId, isActive: true },
    unSelect: ["__v", "shopId"],
  });
};

const updateDiscountCode = async ({ code, shopId, payload }) => {
  const updateDiscountCode = await DiscountModel.findOneAndUpdate(
    { code, shopId },
    { $set: payload },
    { new: true }
  );

  if (!updateDiscountCode) {
    throw new NotFoundError("Discount code does not exist");
  }

  return updateDiscountCode;
};

/**
  1 - ensure the discount code exist and still active
  2 - ensure the code is not expired yet
  3 - ensure the user still have not reached to the max uses
  4 - ensure total order must be at least min value to process discount code
  5 - ensure 
 */

const applyDiscountCode = async ({ code, shopId, products }) => {
  const foundDiscount = await DiscountModel.findOne({ code, shopId }).lean();
  if (!foundDiscount || !foundDiscount.isActive) {
    throw new NotFoundError("Discount code does not exist");
  }

  if (now < new Date(startDate) || now > new Date(endDate)) {
    throw new BadRequestError("Discount code is expired");
  }

  if (new Date(startDate) >= new Date(endDate)) {
    throw new BadRequestError("Start date must be before end date");
  }

  if (foundDiscount.maxUsesPerUser <= 0) {
    throw new BadRequestError(
      "User reached to the maximum number of use discount code"
    );
  }

  if (foundDiscount.minOrderValue > 0) {
    let totalOrder = products.reduce(
      (total, product) =>
        total + product.product_quantity * product.product_price
    );

    if (totalOrder < foundDiscount.minOrderValue) {
      throw new BadRequestError(
        `The minimum total must be ${foundDiscount.minOrderValue}, but the current total value is ${totalOrder}`
      );
    }
  }
};

const DiscountService = {
  createDiscountCode,
  updateDiscountCode,
  findAllProductsWithDiscountCode,
  findAllDiscountCodesByShopId,
};

module.exports = DiscountService;
